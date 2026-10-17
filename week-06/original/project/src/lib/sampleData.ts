import type { Room } from './types';

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Ampitheatre',
    building: 'North Wing',
    capacity: 200,
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, bookedBy: 'Dr. Evans' },
      { id: 'b2', start: 720, end: 780, bookedBy: 'Prof. Lee' },
    ],
  },
  {
    id: 'r2',
    name: 'Lab 101',
    building: 'Science Block',
    capacity: 30,
    blocked: true,
    bookings: [],
  },
  {
    id: 'r3',
    name: 'Study Lounge',
    building: 'Library',
    capacity: 12,
    blocked: false,
    bookings: [
      { id: 'b3', start: 480, end: 540, bookedBy: 'Study Group A' },
      { id: 'b4', start: 900, end: 960, bookedBy: 'Book Club' },
    ],
  },
];
