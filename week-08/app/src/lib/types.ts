export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  start: number; // minutes from 00:00
  end: number;   // minutes from 00:00
  bookedBy: string;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
}
