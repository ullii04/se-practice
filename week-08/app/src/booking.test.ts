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

function expectUnchangedDecision(request: BookingRequest): boolean {
  const before = request.bookings.map((booking) => ({ ...booking }));

  const result = canBook(request);

  expect(request.bookings).toStrictEqual(before);
  return result;
}

describe('canBook', () => {
  it('T01: accepts a request touching the existing booking end', () => {
    expect(expectUnchangedDecision(fixture({ start: 660, end: 720 }))).toBe(true);
  });

  it('T02: rejects a start equal to now', () => {
    expect(expectUnchangedDecision(fixture({ start: 540, end: 570 }))).toBe(false);
  });

  it('T03: rejects equal start and end', () => {
    expect(expectUnchangedDecision(fixture({ start: 720, end: 720 }))).toBe(false);
  });

  it('T04: rejects an end earlier than the start', () => {
    expect(expectUnchangedDecision(fixture({ start: 750, end: 720 }))).toBe(false);
  });

  it('T05: rejects an end beyond minute 1440', () => {
    expect(expectUnchangedDecision(fixture({ start: 1380, end: 1441 }))).toBe(false);
  });

  it('T06: accepts a duration of exactly 120 minutes', () => {
    expect(expectUnchangedDecision(fixture({ start: 720, end: 840 }))).toBe(true);
  });

  it('T07: rejects a duration of 121 minutes', () => {
    expect(expectUnchangedDecision(fixture({ start: 720, end: 841 }))).toBe(false);
  });

  it('T08: accepts a request touching the existing booking start', () => {
    expect(expectUnchangedDecision(fixture({ start: 570, end: 600 }))).toBe(true);
  });

  it('T09: rejects a partial overlap', () => {
    expect(expectUnchangedDecision(fixture({ start: 630, end: 690 }))).toBe(false);
  });

  it('T10: rejects a request containing the existing booking', () => {
    expect(expectUnchangedDecision(fixture({ start: 570, end: 690 }))).toBe(false);
  });

  it('T11: rejects a request contained in the existing booking', () => {
    expect(expectUnchangedDecision(fixture({ start: 615, end: 645 }))).toBe(false);
  });

  it('T12: rejects an identical booking interval', () => {
    expect(expectUnchangedDecision(fixture({ start: 600, end: 660 }))).toBe(false);
  });

  it('T13: rejects an otherwise valid request when the room is blocked', () => {
    expect(expectUnchangedDecision(fixture({ start: 660, end: 720, blocked: true }))).toBe(false);
  });

  it('T14: accepts a request when the bookings list is empty', () => {
    expect(expectUnchangedDecision(fixture({ start: 630, end: 690, bookings: [] }))).toBe(true);
  });

  it('AC5: returns true without saving or changing booking data', () => {
    const request = fixture({ start: 660, end: 720 });
    const before = request.bookings.map((booking) => ({ ...booking }));

    expect(canBook(request)).toBe(true);
    expect(request.bookings).toStrictEqual(before);
  });

  it('X1: accepts minute 1440 as the end boundary', () => {
    expect(expectUnchangedDecision(fixture({ start: 1380, end: 1440 }))).toBe(true);
  });

  it('X2: rejects an overlap with the second booking in the list', () => {
    const request = fixture({
        start: 720,
        end: 780,
        bookings: [
          { start: 600, end: 660 },
          { start: 700, end: 760 },
        ],
    });
    expect(expectUnchangedDecision(request)).toBe(false);
  });

  it('N1: rejects a negative start independently of the future rule', () => {
    expect(expectUnchangedDecision(fixture({ start: -1, end: 30, now: -10, bookings: [] }))).toBe(false);
  });

  it('N2: rejects a start before now without booking conflicts', () => {
    expect(expectUnchangedDecision(fixture({ start: 539, end: 570, now: 540, bookings: [] }))).toBe(false);
  });
});
