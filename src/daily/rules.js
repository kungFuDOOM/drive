// What makes one daily run comparable with another: fixed car and handling, plus the day's twist.

/**
 * Every daily run uses the GP car (Speedway is locked for some players) on Medium handling
 * (Easy adds anti-lock and traction assist). The player's menu settings are restored afterwards.
 */
export const DAILY_RULES = Object.freeze({ mode: 'tt', cls: 'gp', difficulty: 'normal' });

/**
 * Apply the twist to a new time-trial Race. Rain is already down at the start and the player is on wets
 * (a time trial has no pit stops), so every lap of every attempt starts from the same conditions.
 */
export function applyTwist(race, twist) {
  if (twist !== 'rain') return;
  race.setRain(true);
  race.player.tire = 'wet';
}
