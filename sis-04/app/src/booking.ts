import type { Room } from './rooms';

export interface Booking { start: number; end: number }
export interface BookingRequest {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  request: Pick<BookingRequest, 'start' | 'end' | 'now'>,
): boolean {
  const room = rooms.find(({ id }) => id === roomId);
  if (!room) return false;

  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}
