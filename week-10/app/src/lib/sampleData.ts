import type { Room } from './types';

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Amphitheatre',
    building: 'North Wing',
    capacity: 200,
    blocked: false,
    bookings: [
      { id: 'b1', start: 600, end: 660, bookedBy: 'Dr. Evans' }, // 10:00–11:00
    ],
  },
  {
    id: 'r2',
    name: 'Lab 101',
    building: 'Science Block',
    capacity: 30,
    blocked: false,
    bookings: [
      { id: 'b2', start: 600, end: 660, bookedBy: 'Prof. Lee' }, // 10:00–11:00
    ],
  },
  {
    id: 'r3',
    name: 'Study Lounge',
    building: 'Library',
    capacity: 12,
    blocked: false,
    bookings: [
      { id: 'b3', start: 600, end: 660, bookedBy: 'Study Group A' }, // 10:00–11:00
    ],
  },
];
