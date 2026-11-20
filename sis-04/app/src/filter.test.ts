import { expect, test } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const catalog: Room[] = [
  { id: 'edge', name: 'Edge', capacity: 12, equipment: ['Projector', 'Whiteboard'], blocked: false, bookings: [] },
  { id: 'below', name: 'Below', capacity: 11, equipment: ['Projector', 'Whiteboard'], blocked: false, bookings: [] },
  { id: 'partial', name: 'Partial', capacity: 16, equipment: ['Projector'], blocked: false, bookings: [] },
];

test('F1 B5: includes the room with exactly enough seats', () => {
  const matches = filterRooms(catalog, { attendees: 12, equipment: [] });
  expect(matches).toContain(catalog[0]);
});

test('B6: excludes the room with one seat too few', () => {
  const matches = filterRooms(catalog, { attendees: 12, equipment: [] });
  expect(matches).not.toContain(catalog[1]);
});

test('F2: requires every selected equipment item', () => {
  const matches = filterRooms(catalog, { attendees: 12, equipment: ['Projector', 'Whiteboard'] });
  expect(matches).toEqual([catalog[0]]);
});

test('F4: returns an empty list when no room matches', () => {
  expect(filterRooms(catalog, { attendees: 17, equipment: [] })).toEqual([]);
});
