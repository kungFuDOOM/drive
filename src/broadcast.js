// Deterministic broadcast policy: game events become name-neutral local clips + captions.
import LINES from '../public/audio/vo/lines.json' with { type: 'json' };

export const DEFAULT_BROADCAST = Object.freeze({ cutscenes: true, voiceVolume: 0.75, voiceMuted: false });
export const COOLDOWN = Object.freeze({ announcer: 4, engineer: 6, position: 12, offTrack: 20, tyres: 30, gaps: 32, push: 45, pitDecision: 35 });
const SPEAKERS = { announcer: 'RACE CONTROL', engineer: 'PIT WALL' };
const clamp01 = (n) => Math.max(0, Math.min(1, n));
const finite = (x) => Number.isFinite(+x) ? +x : 0;

export function broadcastSettings(settings = {}) {
  if (!settings || typeof settings !== 'object') return { ...DEFAULT_BROADCAST };
  return {
    cutscenes: typeof settings.cutscenes === 'boolean' ? settings.cutscenes : true,
    voiceVolume: Number.isFinite(settings.voiceVolume) ? clamp01(settings.voiceVolume) : 0.75,
    voiceMuted: typeof settings.voiceMuted === 'boolean' ? settings.voiceMuted : false,
  };
}
export function updateBroadcastSettings(settings, patch = {}) {
  if (!patch || typeof patch !== 'object') return broadcastSettings(settings);
  // A slider change deliberately unmutes, but an exclusive mute toggle stays reversible.
  if (Object.keys(patch).length === 1 && 'voiceVolume' in patch) patch = { ...patch, voiceMuted: false };
  return broadcastSettings({ ...broadcastSettings(settings), ...patch });
}
export function cutsceneDuration(mode, settings) {
  return broadcastSettings(settings).cutscenes ? mode === 'tt' ? 2.8 : 8.6 : 0;
}
/** Must genuinely need service, with enough of the race left to use a new stint. */
export function pitIsNeeded(player, race = {}) {
  if (!player || player.finished || player.pit?.stage > 0 || player.pit?.request) return false;
  if (Number.isFinite(race.laps) && finite(player.laps) >= race.laps - 1) return false;
  return finite(player.wear) >= 0.74 ||
    (player.tire === 'dry' && (finite(race.rain) >= 0.45 || finite(race.wetness) >= 0.32)) ||
    (player.tire === 'wet' && finite(race.rain) < 0.05 && finite(race.wetness) < 0.14);
}
export function tyreState(player) {
  return finite(player?.wear) >= 0.68 ? 'critical' : finite(player?.wear) >= 0.48 ? 'warning' : 'ok';
}
export function gapLines(gaps = {}) {
  const out = [];
  if (Number.isFinite(gaps.ahead)) out.push(cue('radio_gap_ahead', `GAP AHEAD  +${gaps.ahead.toFixed(1)}s`, 35));
  if (Number.isFinite(gaps.behind)) out.push(cue('radio_gap_behind', `GAP BEHIND  -${gaps.behind.toFixed(1)}s`, 35));
  return out;
}
export function finishLine(position) {
  return position === 1 ? 'announcer_finish_p1' : position === 2 ? 'announcer_finish_p2' : position === 3 ? 'announcer_finish_p3' : position <= 8 ? 'announcer_finish_points' : 'announcer_finish';
}
function cue(id, caption, priority = 30) {
  if (!LINES[id]) return null;
  return { id, channel: LINES[id].voice, speaker: SPEAKERS[LINES[id].voice], caption: caption || LINES[id].text.toUpperCase(), priority };
}

/** One shared mapping covers point-to-point simulation events; no real names are ever sent to TTS. */
export function eventCues(event, context = {}) {
  const solo = context.solo ?? context.mode === 'tt';
  const pos = context.position || context.player?.pos || 0;
  switch (event?.type) {
    case 'intro': return [cue(solo ? 'announcer_intro_time_trial' : 'announcer_intro', null, 100)];
    case 'go': return solo ? [] : [cue('announcer_start', null, 100), cue('radio_start', 'RADIO CHECK  ·  NICE AND CLEAN INTO TURN ONE', 100)];
    case 'leadchange': return solo ? [] : [cue('announcer_lead_change')];
    case 'winner': return solo || event.car?.isPlayer ? [] : [cue('announcer_winner', null, 90)];
    case 'poschange': {
      if (solo) return [];
      const up = event.to < event.from;
      return [cue(up ? 'announcer_player_overtake' : 'announcer_player_overtaken', up ? `GREAT MOVE  P${event.to}` : `RIVAL THROUGH  P${event.to}`, 60), cue('radio_position', `POSITION  P${event.to}  ${up ? '››' : '‹‹'}`, 60)];
    }
    case 'laptime': return !solo && event.isBest ? [cue('announcer_fastest_lap', `FASTEST LAP  ${(+event.time || 0).toFixed(3)}s`, 55)] : [];
    case 'offtrack': return solo ? [] : [cue('announcer_off_track')];
    case 'finallap': return solo ? [] : [cue('announcer_last_lap', null, 100), cue('radio_bring_home', null, 100)];
    case 'finish': return solo || !event.car?.isPlayer ? [] : [cue('announcer_chequered_flag', null, 100), cue(finishLine(pos), `CHEQUERED FLAG  YOU FINISH P${pos}`, 100)];
    case 'pit': return event.car?.isPlayer ? [cue('radio_pit_complete', null, 100)] : [];
    default: return [];
  }
}

/** Telemetry is pure, so exact wear/weather/lap boundary conditions are tested without a browser. */
export function engineerCues(state = {}) {
  const p = state.player || {};
  if (state.solo || state.phase !== 'racing' || p.finished) return [];
  const out = [];
  if (pitIsNeeded(p, state)) out.push(cue('radio_box_box', `BOX BOX  PIT THIS LAP  ·  TYRES ${Math.round(finite(p.wear) * 100)}% WORN`, 100));
  const tyres = tyreState(p);
  if (tyres !== 'ok') out.push(cue(tyres === 'critical' ? 'radio_tyre_critical' : 'radio_tyre_warning', `${tyres === 'critical' ? 'TYRES CRITICAL' : 'TYRE WEAR'}  ${Math.round(finite(p.wear) * 100)}% WORN`, tyres === 'critical' ? 75 : 45));
  if (p.tire === 'dry' && finite(state.rain) >= 0.45) out.push(cue('radio_wet_weather', 'RAIN  ·  WET TYRES ADVISED', 80));
  if (p.tire === 'wet' && finite(state.rain) < 0.05 && finite(state.wetness) < 0.14) out.push(cue('radio_dry_weather', 'TRACK DRYING  ·  DRY TYRES ADVISED', 75));
  if (state.reportGaps) out.push(...gapLines(state.gaps));
  if (state.time >= 50 && finite(state.gaps?.behind) >= 2.2) out.push(cue('radio_push', `PUSH NOW  ·  GAP BEHIND +${state.gaps.behind.toFixed(1)}s`, 40));
  if (state.finalLap) out.push(cue('radio_bring_home', null, 100));
  return out;
}

/** Each channel holds one pending cue; another can replace it only with >= priority. */
export class BroadcastDirector {
  constructor({ solo = false } = {}) {
    this.solo = solo;
    this.pending = { announcer: null, engineer: null };
    this.next = { announcer: 0, engineer: 0 };
    this.lastPlayed = {};
    this.history = {};
    this.lastLeader = null;
    this.wasOff = false;
    this.gapSide = 'ahead';
    this.nextGap = 50;
    this.gapDeadline = 0;
    this.lastGaps = null;
    this.winnerAnnounced = false;
  }

  /** Only playback dispatch starts cooldowns, not events blocked by an active clip. */
  accept(line, time = 0) {
    if (!line || (this.solo && line.channel === 'engineer')) return false;
    const ready = this.readyFor(line, time);
    if (!ready) return false;
    const previous = this.pending[line.channel];
    if (!previous || line.priority >= previous.priority) { this.pending[line.channel] = line; return true; }
    return false;
  }

  readyFor(line, time) {
    let gate = line.id, cooldown = 2;
    const special = {
      announcer_off_track: 20, announcer_lead_change: 16,
      radio_box_box: 35, radio_tyre_warning: 30, radio_tyre_critical: 25,
      radio_position: 12, radio_push: 45, radio_gap_ahead: 32, radio_gap_behind: 32,
    };
    if (line.id.startsWith('announcer_player_')) { gate = 'overtake'; cooldown = 4; }
    else if (line.id.startsWith('radio_gap_')) { gate = 'gap'; cooldown = 4; }
    else cooldown = special[line.id] || 2;
    return time + 1e-6 >= (this.history[gate] ?? -1e9);
  }

  event(event, context = {}, time = 0) {
    if (event.type === 'winner' && this.winnerAnnounced) return;
    if (event.type === 'winner') this.winnerAnnounced = true;
    for (const line of eventCues(event, context)) this.accept(line, time);
  }

  telemetry(state, time = 0) {
    if (this.solo || state.phase !== 'racing' || state.player?.finished) return;
    const player = state.player || {};
    if (state.leaderId !== this.lastLeader) {
      if (this.lastLeader !== null) this.event({ type: 'leadchange' }, state, time);
      this.lastLeader = state.leaderId;
    }
    const off = player.v > 12 && ['grass', 'gravel'].includes(player.surface);
    if (off && !this.wasOff) this.event({ type: 'offtrack' }, state, time);
    this.wasOff = off;
    this.lastGaps = state.gaps;
    // More urgent service/weather messages win. These are offered every frame;
    // acceptance + cues retain the highest-priority eligible message.
    for (const line of engineerCues({ ...state, solo: false, reportGaps: false })) this.accept(line, time);
    if ((this.pending.engineer?.priority ?? 0) <= 45 && time >= this.nextGap && time >= this.gapDeadline && time >= this.next.engineer) {
      const side = this.gapSide, value = state.gaps?.[side];
      if (Number.isFinite(value)) this.accept(gapLines({ [side]: value })[0], time);
    }
  }

  tick(time, busy = {}) {
    const out = [];
    for (const channel of ['announcer', 'engineer']) {
      const line = this.pending[channel];
      if (!line || time < this.next[channel] || busy[channel]) continue;
      this.pending[channel] = null;
      this.lastPlayed[channel] = time;
      const isGap = line.id.startsWith('radio_gap_');
      if (isGap) {
        this.history.gap = time + 32; // no spam even if telemetry is sampled dozens of times/sec
        const playedSide = line.id.endsWith('ahead') ? 'ahead' : 'behind';
        this.gapSide = playedSide === 'ahead' ? 'behind' : 'ahead';
        this.gapDeadline = time + 7; this.nextGap = time + 32; // next pair after a 32-second cooldown
      } else {
        const gates = { announcer_lead_change: 16, announcer_off_track: 20,
          radio_box_box: 35, radio_tyre_warning: 30, radio_tyre_critical: 25,
          radio_position: 12, radio_push: 45, radio_pit_confirmed: 25 };
        let gate = line.id;
        if (line.id.startsWith('announcer_player_')) gate = 'overtake';
        this.history[gate] = time + (gates[line.id] || (gate === 'overtake' ? 4 : 2));
      }
      // The real audio callback replaces this conservative reserve.
      this.next[channel] = time + (channel === 'announcer' ? 3 : 3.7);
      out.push(line);
    }
    return out;
  }

  release(channel, audioEndTime) {
    this.next[channel] = audioEndTime + 0.8;
  }
  stop() { this.pending.announcer = this.pending.engineer = null; }
}
