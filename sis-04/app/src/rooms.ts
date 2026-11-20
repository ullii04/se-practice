import type { Booking } from './booking';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const ROOMS: Room[] = [
  {
    id: 'cedar',
    name: 'Cedar Studio',
    capacity: 12,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'maple',
    name: 'Maple Hall',
    capacity: 24,
    equipment: ['Projector', 'Whiteboard', 'Video conferencing'],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: 'birch',
    name: 'Birch Workshop',
    capacity: 8,
    equipment: ['Whiteboard'],
    blocked: false,
    bookings: [{ start: 570, end: 615 }],
  },
  {
    id: 'willow',
    name: 'Willow Lab',
    capacity: 16,
    equipment: ['Projector', 'Video conferencing'],
    blocked: true,
    bookings: [{ start: 780, end: 840 }],
  },
];
