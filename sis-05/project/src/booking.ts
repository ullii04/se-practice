export interface Booking { start: number; end: number }
export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export type ReasonCode = 'invalid_time' | 'past_time' | 'too_long' | 'room_blocked' | 'overlap' | 'available';

function evaluateBooking({ start, end, now, blocked, bookings }: BookingRequest): { code: ReasonCode; message: string | null } {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > 1440) {
    return { code: 'invalid_time', message: 'Time must be between 00:00 and 24:00.' };
  }
  if (start >= end) return { code: 'invalid_time', message: 'Start time must be before end time.' };
  if (!Number.isFinite(now) || start <= now) return { code: 'past_time', message: 'Start time must be after the current time.' };
  if (end - start > 120) return { code: 'too_long', message: 'Bookings cannot be longer than 120 minutes.' };
  if (blocked) return { code: 'room_blocked', message: 'This room is currently blocked and cannot be booked.' };
  if (bookings.some((booking) => start < booking.end && end > booking.start)) {
    return { code: 'overlap', message: 'The selected time overlaps an existing booking.' };
  }
  return { code: 'available', message: null };
}

export function bookingRejectionReason(request: BookingRequest): string | null {
  return evaluateBooking(request).message;
}

export function availabilityReason(request: BookingRequest): ReasonCode {
  return evaluateBooking(request).code;
}

export function canBook(request: BookingRequest): boolean {
  return availabilityReason(request) === 'available';
}
