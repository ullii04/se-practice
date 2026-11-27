import type { Room } from './types';

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Amphitheatre',
    building: 'North Wing',
    capacity: 200,
    blocked: false,
    bookings: [
      { id: 'b1', start: 600, end: 660, bookedBy: 'Demo booking' }, // 10:00–11:00
    ],
  },
];
