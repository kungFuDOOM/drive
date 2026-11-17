import { describe, expect, it } from 'vitest';
import { VoiceQueue } from './voiceQueue.js';

const L = (id, channel, priority) => ({ id, channel, priority, caption: id });

describe('VoiceQueue', () => {
  it('plays lines in arrival order among equals', () => {
    const q = new VoiceQueue();
    q.enqueue(L('a', 'announcer', 30), 0); q.enqueue(L('b', 'engineer', 30), 0.1);
    expect(q.next(0.2).id).toBe('a'); expect(q.next(0.2).id).toBe('b'); expect(q.next(0.2)).toBeNull();
  });
  it('urgent pit boss lines go next, ahead of commentary', () => {
    const q = new VoiceQueue();
    q.enqueue(L('chat', 'announcer', 60), 0); q.enqueue(L('box', 'engineer', 100), 1);
    expect(q.next(1).id).toBe('box'); expect(q.next(1).id).toBe('chat');
  });
  it('drops stale low-priority lines after ~4s but keeps urgent ones', () => {
    const q = new VoiceQueue();
    q.enqueue(L('old', 'announcer', 30), 0); q.enqueue(L('warn', 'engineer', 75), 0);
    expect(q.next(5).id).toBe('warn'); expect(q.next(5)).toBeNull(); expect(q.dropped).toBe(1);
  });
  it('keeps fresh lines and clears', () => {
    const q = new VoiceQueue();
    q.enqueue(L('x', 'announcer', 30), 0);
    expect(q.next(3.9).id).toBe('x');
    q.enqueue(L('y', 'announcer', 30), 0); q.clear(); expect(q.next(1)).toBeNull();
  });
});
