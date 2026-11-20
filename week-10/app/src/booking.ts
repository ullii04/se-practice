export interface Booking { start: number; end: number }
export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function bookingRejectionReason({ start, end, now, blocked, bookings }: BookingRequest): string | null {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end > 1440) {
    return 'Time must be between 00:00 and 24:00.';
  }
  if (start >= end) return 'Start time must be before end time.';
  if (!Number.isFinite(now) || start <= now) return 'Start time must be after the current time.';
  if (end - start > 120) return 'Bookings cannot be longer than 120 minutes.';
  if (blocked) return 'This room is currently blocked and cannot be booked.';
  if (bookings.some((booking) => start < booking.end && end > booking.start)) {
    return 'The selected time overlaps an existing booking.';
  }
  return null;
}

export function canBook(request: BookingRequest): boolean {
  return bookingRejectionReason(request) === null;
}
