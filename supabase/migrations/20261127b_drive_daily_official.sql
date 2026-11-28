-- One official run per player per day: the first completed run counts, later ones are stored as unofficial.
alter table drive.daily_runs add column if not exists official boolean not null default false;
update drive.daily_runs r set official = true where r.id in (select distinct on (day_id, player_id) id from drive.daily_runs order by day_id, player_id, created_at, id);
create unique index if not exists daily_runs_one_official on drive.daily_runs (day_id, player_id) where official;
create index if not exists daily_runs_ip_day on drive.daily_runs (ip_hash, day_id) where official;

create or replace function public.drive_submit_run(
  p_day_id text, p_track_id text, p_twist text, p_player_id uuid, p_name text, p_time_ms integer, p_path text)
returns json language plpgsql security definer set search_path = '' as $$
declare
  v_name text := regexp_replace(btrim(coalesce(p_name, '')), '[^A-Za-z0-9 _.\-]', '', 'g');
  v_today date := (now() at time zone 'America/Los_Angeles')::date;
  v_day date;
  v_ip text := nullif(split_part(coalesce((current_setting('request.headers', true)::json ->> 'x-forwarded-for'), ''), ',', 1), '');
  v_ip_hash text;
  v_official boolean;
  v_rank integer;
begin
  if p_day_id is null or p_day_id !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'bad day'; end if;
  v_day := p_day_id::date;
  -- only today's map (a minute of slack either side of the Pacific midnight reset)
  if v_day <> v_today and not (v_day = v_today - 1 and (now() at time zone 'America/Los_Angeles')::time < '00:15')
                       and not (v_day = v_today + 1 and (now() at time zone 'America/Los_Angeles')::time > '23:45') then
    raise exception 'not today';
  end if;
  if char_length(v_name) = 0 then v_name := 'Driver'; end if;
  v_name := left(v_name, 16);
  if p_time_ms is null or p_time_ms < 10000 or p_time_ms > 900000 then raise exception 'bad time'; end if;
  if p_path is null or octet_length(p_path) > 60000 then raise exception 'bad path'; end if;
  if p_player_id is null then raise exception 'bad player'; end if;
  if v_ip is not null then v_ip_hash := encode(extensions.digest(v_ip || ':drive', 'sha256'), 'hex'); end if;

  if (select count(*) from drive.daily_runs where player_id = p_player_id and created_at > now() - interval '10 minutes') >= 30
    or (v_ip_hash is not null and (select count(*) from drive.daily_runs where ip_hash = v_ip_hash and created_at > now() - interval '10 minutes') >= 60)
  then raise exception 'rate limited'; end if;

  perform pg_advisory_xact_lock(hashtext('drive:' || p_day_id || ':' || p_player_id::text));
  v_official := not exists (select 1 from drive.daily_runs where day_id = p_day_id and player_id = p_player_id and official)
    -- a fresh player id from the same network counts only a few times a day (clearing storage is not a free retry)
    and (v_ip_hash is null or (select count(*) from drive.daily_runs where day_id = p_day_id and ip_hash = v_ip_hash and official) < 3);

  insert into drive.daily_runs (day_id, track_id, twist, player_id, name, time_ms, path, ip_hash, official)
  values (p_day_id, left(coalesce(p_track_id, ''), 32), left(coalesce(p_twist, ''), 16), p_player_id, v_name, p_time_ms, p_path, v_ip_hash, v_official);

  select r.rank into v_rank from (
    select player_id, rank() over (order by time_ms, created_at) as rank
    from drive.daily_runs where day_id = p_day_id and official) r
  where r.player_id = p_player_id;
  return json_build_object('official', v_official, 'rank', v_rank);
end $$;

create or replace function public.drive_leaderboard(p_day_id text, p_player_id uuid default null, p_limit integer default 10)
returns json language sql stable security definer set search_path = '' as $$
  with ranked as (
    select player_id, name, time_ms, rank() over (order by time_ms, created_at) as rank
    from drive.daily_runs where day_id = p_day_id and official
  )
  select json_build_object(
    'total', (select count(*) from ranked),
    'top', coalesce((select json_agg(json_build_object('rank', rank, 'name', name, 'time_ms', time_ms, 'me', player_id = p_player_id) order by rank)
              from (select * from ranked order by rank limit least(greatest(coalesce(p_limit, 10), 1), 50)) t), '[]'::json),
    'me', (select json_build_object('rank', rank, 'name', name, 'time_ms', time_ms) from ranked where player_id = p_player_id)
  );
$$;

create or replace function public.drive_admin_replay(p_key text, p_day_id text)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if p_key is null or not exists (select 1 from drive.admin_keys where key_hash = encode(extensions.digest(p_key, 'sha256'), 'hex')) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return coalesce((
    select json_agg(json_build_object('name', name, 'time_ms', time_ms, 'track_id', track_id, 'twist', twist, 'path', path) order by time_ms, created_at)
    from drive.daily_runs where day_id = p_day_id and official), '[]'::json);
end $$;

revoke all on function public.drive_submit_run(text, text, text, uuid, text, integer, text) from public;
grant execute on function public.drive_submit_run(text, text, text, uuid, text, integer, text) to anon, authenticated;
