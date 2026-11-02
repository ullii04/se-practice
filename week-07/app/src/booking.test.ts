// app/src/booking.test.ts
import { describe, expect, it } from 'vitest';
import { canBook, type BookingRequest } from './booking';

function fixture(
  overrides: Partial<BookingRequest> = {},
): BookingRequest {
  return {
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

function expectDecision(request: BookingRequest, expected: boolean): void {
  const before = request.bookings.map((booking) => ({ ...booking }));

  const result = canBook(request);

  expect(typeof result).toBe('boolean');
  expect(result).toBe(expected);
  expect(request.bookings).toStrictEqual(before);
}

describe('canBook', () => {
  it('T01: accepts a request touching the existing booking end', () => {
    expectDecision(fixture({ start: 660, end: 720 }), true);
  });

  it('T02: rejects a start equal to now', () => {
    expectDecision(fixture({ start: 540, end: 570 }), false);
  });

  it('T03: rejects equal start and end', () => {
    expectDecision(fixture({ start: 720, end: 720 }), false);
  });

  it('T04: rejects an end earlier than the start', () => {
    expectDecision(fixture({ start: 750, end: 720 }), false);
  });

  it('T05: rejects an end beyond minute 1440', () => {
    expectDecision(fixture({ start: 1380, end: 1441 }), false);
  });

  it('T06: accepts a duration of exactly 120 minutes', () => {
    expectDecision(fixture({ start: 720, end: 840 }), true);
  });

  it('T07: rejects a duration of 121 minutes', () => {
    expectDecision(fixture({ start: 720, end: 841 }), false);
  });

  it('T08: accepts a request touching the existing booking start', () => {
    expectDecision(fixture({ start: 570, end: 600 }), true);
  });

  it('T09: rejects a partial overlap', () => {
    expectDecision(fixture({ start: 630, end: 690 }), false);
  });

  it('T10: rejects a request containing the existing booking', () => {
    expectDecision(fixture({ start: 570, end: 690 }), false);
  });

  it('T11: rejects a request contained in the existing booking', () => {
    expectDecision(fixture({ start: 615, end: 645 }), false);
  });

  it('T12: rejects an identical booking interval', () => {
    expectDecision(fixture({ start: 600, end: 660 }), false);
  });

  it('T13: rejects an otherwise valid request when the room is blocked', () => {
    expectDecision(fixture({ start: 660, end: 720, blocked: true }), false);
  });

  it('T14: accepts a request when the bookings list is empty', () => {
    expectDecision(fixture({ start: 630, end: 690, bookings: [] }), true);
  });

  it('AC5: returns true without saving or changing booking data', () => {
    expectDecision(fixture({ start: 660, end: 720 }), true);
  });

  it('X1: accepts minute 1440 as the end boundary', () => {
    expectDecision(fixture({ start: 1380, end: 1440 }), true);
  });

  it('X2: rejects an overlap with the second booking in the list', () => {
    expectDecision(
      fixture({
        start: 720,
        end: 780,
        bookings: [
          { start: 600, end: 660 },
          { start: 700, end: 760 },
        ],
      }),
      false,
    );
  });
});
