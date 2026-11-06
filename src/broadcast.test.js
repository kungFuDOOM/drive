import { describe, expect, it } from 'vitest';
import { BroadcastDirector, broadcastSettings, updateBroadcastSettings, cutsceneDuration, DEFAULT_BROADCAST, COOLDOWN, pitIsNeeded, tyreState, gapLines, eventCues, finishLine, engineerCues } from './broadcast.js';
import fs from 'node:fs';

const p = (over = {}) => ({ pos: 5, laps: 2, wear: 0.2, tire: 'dry', surface: 'asphalt', v: 30, progress: 1000, lapsDone: 2, pit: { stage: 0, request: false }, ...over });
const g = { ahead: 1.43, behind: 2.72 };
const state = (over = {}) => ({ phase: 'racing', laps: 4, player: p(), rain: 0, wetness: 0, gaps: g, leaderId: 0, time: 55, ...over });

describe('broadcast settings', () => {
  it('has safe opt-in cinema defaults, voice on, and a moderate starting volume', () => {
    expect(broadcastSettings()).toEqual(DEFAULT_BROADCAST);
    expect(broadcastSettings({ voiceVolume: 4, voiceMuted: 'false', cutscenes: 'no' })).toEqual({ voiceVolume: 1, voiceMuted: false, cutscenes: true });
    expect(broadcastSettings({ voiceVolume: null })).toMatchObject({ voiceVolume: 0.75 });
    expect(broadcastSettings({ voiceVolume: NaN })).toMatchObject({ voiceVolume: 0.75 });
    expect(cutsceneDuration('race')).toBeGreaterThanOrEqual(6);
    expect(cutsceneDuration('race')).toBeLessThanOrEqual(10);
    expect(cutsceneDuration('tt')).toBeGreaterThan(0);
    expect(cutsceneDuration('race', { cutscenes: false })).toBe(0);
    expect(cutsceneDuration('tt', { cutscenes: false })).toBe(0);
  });

  it('persists actual toggle and slider values and can round-trip JSON without coercion bugs', () => {
    const out = updateBroadcastSettings({}, { cutscenes: false, voiceVolume: 0.4, voiceMuted: true });
    expect(JSON.parse(JSON.stringify(out))).toEqual({ cutscenes: false, voiceVolume: 0.4, voiceMuted: true });
    expect(updateBroadcastSettings(out, { voiceVolume: 0 })).toMatchObject({ voiceMuted: false, cutscenes: false, voiceVolume: 0 });
    expect(updateBroadcastSettings(out, { voiceMuted: true })).toMatchObject({ voiceMuted: true, cutscenes: false, voiceVolume: 0.4 });
    expect(updateBroadcastSettings(out, { voiceMuted: false, cutscenes: true })).toMatchObject({ voiceMuted: false, cutscenes: true });
  });
});

describe('race engineer pit and tyre judgement', () => {
  it('does not cry box box on good tyres, ordinary worn tyres, or just randomly', () => {
    expect(pitIsNeeded(p(), { laps: 4, wetness: 0, rain: 0 })).toBe(false);
    expect(pitIsNeeded(p({ wear: 0.73 }), { laps: 4 })).toBe(false);
    const radio = engineerCues(state({ player: p({ wear: 0.73 }) }));
    expect(radio.some((q) => q.id === 'radio_box_box')).toBe(false);
    expect(radio.some((q) => q.id === 'radio_tyre_critical')).toBe(true);
  });

  it.each([
    [p({ wear: 0.74 }), { laps: 4 }, true],
    [p({ wear: 0.8 }), { laps: 4 }, true],
    [p({ wear: 0.1 }), { laps: 4, rain: 0.45 }, true],
    [p({ tire: 'wet' }), { laps: 4, rain: 0, wetness: 0.13 }, true],
    [p({ wear: 0.8 }), { laps: 4, rain: 0 }, true],
    [p({ wear: 0.9, laps: 3 }), { laps: 4 }, false],
    [p({ wear: 0.9, finished: true }), { laps: 4 }, false],
    [p({ wear: 0.9, pit: { stage: 1, request: true } }), { laps: 4 }, false],
    [p({ wear: 0.9, pit: { stage: 0, request: true } }), { laps: 4 }, false],
  ])('gates pit call by tyre state, lap, finish, and existing request', (player, race, want) => {
    expect(pitIsNeeded(player, race)).toBe(want);
  });

  it('calls the pits during a decisive weather change but never in time trial', () => {
    const wet = engineerCues(state({ rain: 0.6 }));
    expect(wet.some((q) => q.id === 'radio_box_box')).toBe(true);
    expect(engineerCues(state({ rain: 0.6, solo: true }))).toEqual([]);
    expect(engineerCues(state({ rain: 0.6, phase: 'countdown' }))).toEqual([]);
  });

  it('formats live gap numbers separately from generic pre-rendered voice lines', () => {
    const lines = gapLines(g);
    expect(lines.map((q) => q.id)).toEqual(['radio_gap_ahead', 'radio_gap_behind']);
    expect(lines[0].caption).toBe('GAP AHEAD  +1.4s');
    expect(lines[1].caption).toBe('GAP BEHIND  -2.7s');
    expect(gapLines({})).toEqual([]);
  });
});

describe('announcer event catalog', () => {
  it('covers start, lead changes, overtakes both ways, fastest lap, off-track, final lap and flag', () => {
    const expected = {
      go: 'announcer_start', leadchange: 'announcer_lead_change', fastest: 'announcer_fastest_lap', offtrack: 'announcer_off_track', finallap: 'announcer_last_lap', winner: 'announcer_winner',
    };
    for (const [type, id] of Object.entries(expected)) {
      const ev = type === 'fastest' ? { type: 'laptime', isBest: true, time: 42.1234 } : { type, car: { isPlayer: false } };
      const [line] = eventCues(ev, { player: p(), solo: false });
      expect(line.id).toBe(id); expect(line.caption.length).toBeGreaterThan(5);
    }
    expect(eventCues({ type: 'poschange', from: 6, to: 5 })[0].id).toBe('announcer_player_overtake');
    expect(eventCues({ type: 'poschange', from: 4, to: 5 })[0].id).toBe('announcer_player_overtaken');
    expect(eventCues({ type: 'finish', car: { isPlayer: true } }, { position: 7 }).map((x) => x.id)).toEqual(['announcer_chequered_flag', 'announcer_finish_points']);
  });

  it('announces winner, podium, points and full finishing position caption without driver-name recordings', () => {
    expect([1, 2, 3, 7, 10].map(finishLine)).toEqual(['announcer_finish_p1', 'announcer_finish_p2', 'announcer_finish_p3', 'announcer_finish_points', 'announcer_finish']);
    expect(eventCues({ type: 'winner', car: { isPlayer: true } })).toEqual([]);
    expect(eventCues({ type: 'go' }, { solo: true })).toEqual([]);
  });
});

describe('broadcast director queue', () => {
  const st = (over = {}) => state({ leaderId: 0, time: 60, ...over });
  it('queues announcer and position cues separately, then spaces repeat calls', () => {
    const d = new BroadcastDirector();
    d.event({ type: 'poschange', from: 9, to: 8 }, {}, 0);
    expect(d.pending.announcer.id).toBe('announcer_player_overtake');
    expect(d.pending.engineer.id).toBe('radio_position');
    d.event({ type: 'poschange', from: 8, to: 7 }, {}, 1);
    expect(d.tick(0, {}).map((q) => q.id)).toEqual(['announcer_player_overtake', 'radio_position']);
    expect(d.tick(1, {})).toEqual([]);
  });

  it('prioritizes a true worn-tyre box box above a simultaneous routine gap message', () => {
    const d = new BroadcastDirector(), worn = st({ player: p({ wear: .8 }), gaps: g });
    d.telemetry(worn, 60); d.telemetry(worn, 61);
    expect(d.pending.engineer.id).toBe('radio_box_box');
    expect(d.tick(61, {}).map((q) => q.id)).toContain('radio_box_box');
    d.telemetry(worn, 65); expect(d.pending.engineer.id).toBe('radio_tyre_critical'); // a useful follow-up, but still queued behind the active call
    d.telemetry(worn, 98); expect(d.pending.engineer.id).toBe('radio_box_box');
  });

  it('starts periodic gap reports at fifty seconds; pairs left and right sides', () => {
    const d = new BroadcastDirector();
    const quiet = st({ gaps: { ahead: 1.4, behind: 2.7 } });
    d.telemetry(st({ time: 5 }), 5); expect(d.pending.engineer).toBeNull();
    const clean={...quiet,gaps:{ahead:1.4,behind:1.1}};
    d.telemetry(clean, 60); expect(d.pending.engineer.id).toBe('radio_gap_ahead');
    const first = d.tick(61, {}); expect(first.map((q) => q.id)).toEqual(['radio_gap_ahead']);
    expect(d.pending.engineer).toBeNull();
    d.telemetry(clean, 62); expect(d.pending.engineer).toBeNull(); // pair arrives after a short gap
    d.telemetry(clean, 69); expect(d.pending.engineer).toBeNull(); // the two routine updates are never squashed
    d.release('engineer', 92);
    d.telemetry(clean, 93); expect(d.pending.engineer.id).toBe('radio_gap_behind');
    expect(d.tick(93, {}).map((q) => q.id)).toEqual(['radio_gap_behind']);
    d.telemetry(clean, 99); expect(d.pending.engineer).toBeNull();
    d.telemetry(clean, 127); expect(d.pending.engineer.id).toBe('radio_gap_ahead');
  });

  it('reports individual position updates and off-track excursions once', () => {
    const d = new BroadcastDirector();
    d.telemetry(st({ time: 10, gaps: {}, leaderId: 1 }), 10);
    expect(d.pending.announcer).toBeNull();
    d.telemetry(st({ time: 20, gaps: {}, leaderId: 0 }), 20);
    expect(d.tick(20, {}).map((q) => q.id)).toEqual(['announcer_lead_change']);
    d.telemetry(st({ time: 25, gaps: {}, player: p({ surface: 'grass' }) }), 25);
    d.telemetry(st({ time: 26, gaps: {}, player: p({ surface: 'grass' }) }), 26);
    expect(d.pending.announcer.id).toBe('announcer_off_track');
  });

  it('maps tyre threshold and final-lap engineer prompts', () => {
    expect(tyreState(p({ wear: .48 }))).toBe('warning');
    expect(tyreState(p({ wear: .68 }))).toBe('critical');
    expect(engineerCues(st()).some((q) => q.id === 'radio_push')).toBe(true);
    expect(eventCues({ type: 'finallap' }).some((q) => q.id === 'radio_bring_home')).toBe(true);
    expect(eventCues({ type: 'pit', car: { isPlayer: true } })[0].id).toBe('radio_pit_complete');
  });
});

describe('local VO asset and security contract', () => {
  it('shares one catalog between event policy and generated clips', () => {
    const lines = JSON.parse(fs.readFileSync(new URL('../public/audio/vo/lines.json', import.meta.url), 'utf8'));
    const ids = Object.keys(lines);
    expect(ids.length).toBe(29);
    for (const id of ids) {
      const audio = fs.readFileSync(new URL(`../public/audio/vo/${id}.mp3`, import.meta.url));
      expect(audio.length).toBeGreaterThan(1000);
    }
    expect(Object.values(lines).reduce((n, l) => n + l.text.length, 0)).toBeLessThan(3000);
  });
});
