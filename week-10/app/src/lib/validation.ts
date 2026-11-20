import { bookingRejectionReason } from '../booking';
import type { Room, AvailabilityResult } from './types';

export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): AvailabilityResult {
  const reason = bookingRejectionReason({
    start, end, now: currentTime, blocked: room.blocked, bookings: room.bookings,
  });
  return reason === null ? { available: true } : { available: false, reason };
}
