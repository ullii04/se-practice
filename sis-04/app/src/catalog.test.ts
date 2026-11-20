import { expect, test } from 'vitest';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const rooms: Room[] = [
  { id: 'free', name: 'Free', capacity: 12, equipment: ['Projector'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'busy', name: 'Busy', capacity: 16, equipment: ['Projector'], blocked: false, bookings: [{ start: 660, end: 720 }] },
  { id: 'blocked', name: 'Blocked', capacity: 12, equipment: [], blocked: true, bookings: [] },
];
const slot = { start: 660, end: 690, now: 540 };

test('F3: rejects an otherwise free slot in a blocked room', () => {
  expect(checkRoom(rooms, 'blocked', slot)).toBe(false);
});

test('F5: the same slot can be free in one room and busy in another', () => {
  const before = structuredClone(rooms);
  expect(checkRoom(rooms, 'free', slot)).toBe(true);
  expect(checkRoom(rooms, 'busy', slot)).toBe(false);
  expect(rooms).toEqual(before);
});

test('INT: checks the selected room from the filtered catalog', () => {
  const matches = filterRooms(rooms, { attendees: 13, equipment: ['Projector'] });
  expect(matches.map((room) => room.id)).toEqual(['busy']);
  expect(checkRoom(matches, 'busy', slot)).toBe(false);
});

test('Unknown room ID cannot produce an availability result', () => {
  expect(checkRoom(rooms, 'missing', slot)).toBe(false);
});
