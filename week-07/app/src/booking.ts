export interface Booking { start: number; end: number }
export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (start < 0 || end > 1440) return false;
  if (start >= end) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  if (bookings.some((b) => start < b.end && end > b.start)) return false;
  return true;
}
