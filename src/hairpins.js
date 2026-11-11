// Named clog zones (stations in metres along the centre line, car.s): braking zone to exit of the corners where the
// AI field used to queue or touch. Pure data + lookup; used by the headless traffic metric and its tests.

/** { trackId: [{ id, name, s0, s1, apex, walled? }] }. `apex` is a station or a list of stations. */
export const HAIRPINS = {
  citadel: [
    { id: 'crown', name: 'Crown Hairpin', s0: 740, s1: 910, apex: 796 },
    { id: 'plunge', name: 'Plunge Chicane', s0: 960, s1: 1100, apex: [1020, 1065] },
    { id: 'squeeze', name: 'Citadel Squeeze', s0: 1240, s1: 1630, apex: [1371, 1430, 1490, 1530], walled: true },
    { id: 'moat', name: 'Moat Sweep', s0: 1650, s1: 1830, apex: 1722 },
  ],
  highpine: [
    { id: 'summit', name: 'Summit Hairpin', s0: 900, s1: 1120, apex: 1022 },
    { id: 'ridge', name: 'Ridge Kink', s0: 1120, s1: 1260, apex: 1165 },
    { id: 'lodge', name: 'Lodge Sweep', s0: 1640, s1: 1800, apex: 1720 },
  ],
  dripwood: [
    { id: 'root', name: 'Root Hairpin', s0: 920, s1: 1070, apex: 1028 },
    { id: 'puddle', name: 'Puddle Left', s0: 1180, s1: 1290, apex: 1236 },
    { id: 'owl', name: 'Owl Sweep', s0: 1780, s1: 1960, apex: 1868 },
  ],
  desert: [
    { id: 'mesa', name: 'Mesa Hairpin', s0: 1000, s1: 1190, apex: 1106 },
    { id: 'scorpion', name: 'Scorpion Left', s0: 1280, s1: 1445, apex: 1362 },
    { id: 'sandglass', name: 'Sandglass Hairpin', s0: 2040, s1: 2225, apex: 2117 },
  ],
  lampwick: [
    { id: 'arcade', name: 'Arcade Left', s0: 620, s1: 705, apex: 663 },
    { id: 'hotelIn', name: 'Hotel Hairpin entry', s0: 760, s1: 910, apex: 879 },
    { id: 'hotelOut', name: 'Hotel Hairpin exit', s0: 910, s1: 1040, apex: 945 },
    { id: 'clock', name: 'Clock Corner', s0: 1290, s1: 1410, apex: 1353 },
  ],
  coastal: [
    { id: 'lantern', name: 'Lantern Hairpin', s0: 930, s1: 1080, apex: 995 },
    { id: 'tidewall', name: 'Tidewall Hairpin', s0: 1180, s1: 1340, apex: 1244 },
    { id: 'kelp', name: 'Kelp Chicane', s0: 1430, s1: 1560, apex: 1516 },
  ],
};

/** Worst baseline zones (field crawled there before the line relief). */
export const WORST = { highpine: ['ridge', 'lodge'], dripwood: ['owl'], lampwick: ['hotelOut', 'clock'] };

/** Zone containing station s on a track (first match, windows inclusive), or null. */
export function hairpinAt(trackId, s) {
  const zs = HAIRPINS[trackId];
  if (!zs) return null;
  for (const z of zs) if (s >= z.s0 && s <= z.s1) return z;
  return null;
}
