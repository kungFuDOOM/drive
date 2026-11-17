// One shared speech queue for the race commentator (announcer) and the pit boss (engineer).
// Only one line speaks at a time: a new line waits for the current one to finish, and nothing
// is ever interrupted mid-word. Urgent pit-wall calls go next; stale low-priority chatter is dropped.
export const MAX_WAIT = 4;       // seconds a low-priority line may wait before it is dropped
export const URGENT_PRIORITY = 70;

/** Pit boss lines the player must hear: pit calls, tyre/weather warnings. */
export function isUrgent(line) {
  return line.channel === 'engineer' && (line.priority ?? 0) >= URGENT_PRIORITY;
}

export class VoiceQueue {
  constructor({ maxWait = MAX_WAIT } = {}) {
    this.maxWait = maxWait;
    this.items = [];
    this.dropped = 0;
  }

  get length() { return this.items.length; }

  enqueue(line, now) {
    if (!line) return;
    this.items.push({ line, at: now });
  }

  /** Drop stale non-urgent lines, then return the next line to speak (or null). Call only when idle. */
  next(now) {
    const before = this.items.length;
    this.items = this.items.filter((it) => isUrgent(it.line) || (it.line.priority ?? 0) >= 90 || now - it.at <= this.maxWait);
    this.dropped += before - this.items.length;
    if (!this.items.length) return null;
    let best = 0;
    const rank = (it) => [isUrgent(it.line) ? 1 : 0, it.line.priority ?? 0];
    for (let i = 1; i < this.items.length; i++) {
      const [ua, pa] = rank(this.items[best]), [ub, pb] = rank(this.items[i]);
      if (ub > ua || (ub === ua && pb > pa)) best = i; // ties keep arrival order
    }
    return this.items.splice(best, 1)[0].line;
  }

  clear() { this.items.length = 0; }
}
