-- Drive daily race: runs, leaderboard, owner-only replay. Lives in the pokejam project under its own schema.
create schema if not exists drive;
revoke all on schema drive from public, anon, authenticated;

create table if not exists drive.daily_runs (
  id bigint generated always as identity primary key,
  day_id text not null check (day_id ~ '^\d{4}-\d{2}-\d{2}$'),
  track_id text not null check (char_length(track_id) between 1 and 32),
  twist text not null default '' check (char_length(twist) <= 16),
  player_id uuid not null,
  name text not null check (char_length(name) between 1 and 16),
  time_ms integer not null check (time_ms between 10000 and 900000),
  path text not null check (octet_length(path) <= 60000),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists daily_runs_day_time on drive.daily_runs (day_id, time_ms);
create index if not exists daily_runs_player on drive.daily_runs (player_id, created_at);
create index if not exists daily_runs_ip on drive.daily_runs (ip_hash, created_at);
alter table drive.daily_runs enable row level security;
-- no policies: the table is reachable only through the security definer functions below.

create table if not exists drive.admin_keys (
  key_hash text primary key,
  created_at timestamptz not null default now()
);
alter table drive.admin_keys enable row level security;

-- Submit one finished lap. Returns the player's rank for that day.
create or replace function public.drive_submit_run(
  p_day_id text, p_track_id text, p_twist text, p_player_id uuid, p_name text, p_time_ms integer, p_path text)
returns json language plpgsql security definer set search_path = '' as $$
declare
  v_name text := regexp_replace(btrim(coalesce(p_name, '')), '[^A-Za-z0-9 _.\-]', '', 'g');
  v_today date := (now() at time zone 'America/Los_Angeles')::date;
  v_day date;
  v_ip text := nullif(split_part(coalesce((current_setting('request.headers', true)::json ->> 'x-forwarded-for'), ''), ',', 1), '');
  v_ip_hash text;
  v_rank integer;
begin
  if p_day_id is null or p_day_id !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'bad day'; end if;
  v_day := p_day_id::date;
  if v_day > v_today + 1 or v_day < v_today - 60 then raise exception 'bad day'; end if;
  if char_length(v_name) = 0 then v_name := 'Driver'; end if;
  v_name := left(v_name, 16);
  if p_time_ms is null or p_time_ms < 10000 or p_time_ms > 900000 then raise exception 'bad time'; end if;
  if p_path is null or octet_length(p_path) > 60000 then raise exception 'bad path'; end if;
  if p_player_id is null then raise exception 'bad player'; end if;
  if v_ip is not null then v_ip_hash := encode(extensions.digest(v_ip || ':drive', 'sha256'), 'hex'); end if;

  if (select count(*) from drive.daily_runs where player_id = p_player_id and created_at > now() - interval '10 minutes') >= 30
    or (v_ip_hash is not null and (select count(*) from drive.daily_runs where ip_hash = v_ip_hash and created_at > now() - interval '10 minutes') >= 60)
  then raise exception 'rate limited'; end if;

  insert into drive.daily_runs (day_id, track_id, twist, player_id, name, time_ms, path, ip_hash)
  values (p_day_id, left(coalesce(p_track_id, ''), 32), left(coalesce(p_twist, ''), 16), p_player_id, v_name, p_time_ms, p_path, v_ip_hash);

  select r.rank into v_rank from (
    select player_id, rank() over (order by min(time_ms)) as rank
    from drive.daily_runs where day_id = p_day_id group by player_id) r
  where r.player_id = p_player_id;
  return json_build_object('rank', v_rank);
end $$;

-- Top times for a day (best per player, no path data) plus the caller's own row.
create or replace function public.drive_leaderboard(p_day_id text, p_player_id uuid default null, p_limit integer default 10)
returns json language sql stable security definer set search_path = '' as $$
  with best as (
    select distinct on (player_id) player_id, name, time_ms, created_at
    from drive.daily_runs where day_id = p_day_id
    order by player_id, time_ms, created_at
  ), ranked as (
    select player_id, name, time_ms, rank() over (order by time_ms, created_at) as rank from best
  )
  select json_build_object(
    'total', (select count(*) from ranked),
    'top', coalesce((select json_agg(json_build_object('rank', rank, 'name', name, 'time_ms', time_ms, 'me', player_id = p_player_id) order by rank)
              from (select * from ranked order by rank limit least(greatest(coalesce(p_limit, 10), 1), 50)) t), '[]'::json),
    'me', (select json_build_object('rank', rank, 'name', name, 'time_ms', time_ms) from ranked where player_id = p_player_id)
  );
$$;

-- Owner only: every player's best run with its path, for the all-racers replay.
create or replace function public.drive_admin_replay(p_key text, p_day_id text)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  if p_key is null or not exists (select 1 from drive.admin_keys where key_hash = encode(extensions.digest(p_key, 'sha256'), 'hex')) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return coalesce((
    select json_agg(json_build_object('name', name, 'time_ms', time_ms, 'track_id', track_id, 'twist', twist, 'path', path) order by time_ms)
    from (select distinct on (player_id) name, time_ms, track_id, twist, path from drive.daily_runs
          where day_id = p_day_id order by player_id, time_ms, created_at) b), '[]'::json);
end $$;

revoke all on function public.drive_submit_run(text, text, text, uuid, text, integer, text) from public;
revoke all on function public.drive_leaderboard(text, uuid, integer) from public;
revoke all on function public.drive_admin_replay(text, text) from public;
grant execute on function public.drive_submit_run(text, text, text, uuid, text, integer, text) to anon, authenticated;
grant execute on function public.drive_leaderboard(text, uuid, integer) to anon, authenticated;
grant execute on function public.drive_admin_replay(text, text) to anon, authenticated;
