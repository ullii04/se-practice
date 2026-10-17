import type { Room, AvailabilityResult } from './types';

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): AvailabilityResult {
  if (start < 0 || end > 1440) {
    return { available: false, reason: 'Time must be between 00:00 and 24:00.' };
  }
  if (start >= end) {
    return { available: false, reason: 'Start time must be before end time.' };
  }
  if (start < currentTime) {
    return { available: false, reason: 'Start time must be after the current time.' };
  }
  if (end - start > 120) {
    return { available: false, reason: 'Bookings cannot be longer than 120 minutes.' };
  }
  if (room.blocked) {
    return { available: false, reason: 'This room is currently blocked and cannot be booked.' };
  }
  const overlap = room.bookings.some((b) => start < b.end && end > b.start);
  if (overlap) {
    return { available: false, reason: 'The selected time overlaps an existing booking.' };
  }
  return { available: true };
}
