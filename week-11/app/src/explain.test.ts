import { describe, expect, test, vi } from 'vitest';
import { availabilityReason, canBook, type BookingRequest } from './booking';
import { explainAvailability, mockAdapter, type ExplanationInput } from './explain';

const booking: BookingRequest = {
  start: 660, end: 720, now: 540, blocked: false, bookings: [{ start: 600, end: 660 }],
};

function input(overrides: Partial<BookingRequest> = {}, label = 'Demo Room'): ExplanationInput {
  const request = { ...booking, ...overrides };
  const time = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  return {
    roomLabel: label, start: time(request.start), end: time(request.end),
    isAvailable: canBook(request), reasonCode: availabilityReason(request),
  };
}

describe('Explain availability', () => {
  test('E1 F1 F2: touching the prior booking is available and explained', async () => {
    const request = input();
    expect(request.reasonCode).toBe('available');
    expect(await explainAvailability(request, mockAdapter)).toEqual({
      explanation: 'The room is available from 11:00 to 12:00.', source: 'generated',
    });
  });

  test('E2 F2: overlapping slot is unavailable and the explanation mentions overlap', async () => {
    const request = input({ start: 630, end: 690 });
    expect(request.reasonCode).toBe('overlap');
    const result = await explainAvailability(request, mockAdapter);
    expect(result.source).toBe('generated');
    expect(result.explanation).toMatch(/unavailable.*overlaps/);
  });

  test('E3 F2: a blocked room is explained as blocked', async () => {
    const request = input({ blocked: true });
    expect(request.reasonCode).toBe('room_blocked');
    expect((await explainAvailability(request, mockAdapter)).explanation).toContain('room is blocked');
  });

  test('E4 F2: a reversed interval receives the invalid-time explanation', async () => {
    const request = input({ start: 750, end: 720 });
    expect(request.reasonCode).toBe('invalid_time');
    expect((await explainAvailability(request, mockAdapter)).explanation).toContain('interval is invalid');
  });

  test('E5 F2: a past slot receives the past-time explanation', async () => {
    const request = input({ start: 480, end: 510 });
    expect(request.reasonCode).toBe('past_time');
    expect((await explainAvailability(request, mockAdapter)).explanation).toContain('current time');
  });

  test('E6 F3: rejects a blank room label before invoking the adapter', async () => {
    let invoked = false;
    await expect(explainAvailability(input({}, '   '), async () => {
      invoked = true;
    })).rejects.toThrow('Room label');
    expect(invoked).toBe(false);
  });

  test('E7 F3: rejects a 500-character room label', async () => {
    await expect(explainAvailability(input({}, 'x'.repeat(500)), mockAdapter)).rejects.toThrow('Room label');
  });

  test('E8 F4: unresolved adapter reaches fallback at the deadline', async () => {
    vi.useFakeTimers();
    try {
      const pending = explainAvailability(input(), () => new Promise(() => {}), 25);
      await vi.advanceTimersByTimeAsync(25);
      expect(await pending).toEqual({
        explanation: 'The room is available from 11:00 to 12:00.', source: 'fallback',
      });
    } finally {
      vi.useRealTimers();
    }
  });

  test('E9 F4: an adapter error returns the overlap fallback', async () => {
    const result = await explainAvailability(input({ start: 630, end: 690 }), async () => {
      throw new Error('Simulated API failure');
    });
    expect(result.source).toBe('fallback');
    expect(result.explanation).toMatch(/unavailable.*overlaps/);
  });
});

test('V1 F2: contradictory output cannot override the explanation verdict', async () => {
  const result = await explainAvailability(input({ start: 630, end: 690 }), async () => ({
    explanation: 'The room is available. Another room is unavailable.',
  }));
  expect(result.source).toBe('fallback');
  expect(result.explanation).toContain('overlaps');
});

test('V2 F2: a wrong reason or an invented time uses the overlap fallback', async () => {
  const request = input({ start: 630, end: 690 });
  for (const explanation of [
    'The room is unavailable because it is blocked.',
    'The room is unavailable because it overlaps an existing booking until 9 pm.',
  ]) {
    const result = await explainAvailability(request, async () => ({ explanation }));
    expect(result).toEqual({
      source: 'fallback',
      explanation: 'The room is unavailable because the requested time overlaps an existing booking.',
    });
  }
});
