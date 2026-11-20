import type { Room } from '@/rooms';
import { minutesToLabel } from '@/lib/format';

interface Props {
  rooms: Room[];
  selectedRoomId: string | undefined;
  onSelect: (id: string) => void;
}

export default function RoomList({ rooms, selectedRoomId, onSelect }: Props) {
  if (rooms.length === 0) {
    return (
      <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        No rooms match. Lower the attendee count or remove an equipment requirement.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rooms.map((room) => {
        const selected = room.id === selectedRoomId;
        return (
          <button
            type="button"
            key={room.id}
            onClick={() => onSelect(room.id)}
            aria-pressed={selected}
            className={`rounded-xl border p-4 text-left ${selected
              ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
              : 'border-slate-200 bg-white hover:border-slate-400'}`}
          >
            <span className="block font-semibold text-slate-900">{room.name}</span>
            <span className="block text-sm text-slate-700">{room.capacity} seats · {room.equipment.join(', ')}</span>
            {room.blocked && <span className="block text-sm font-medium text-red-700">Blocked</span>}
            {room.bookings.map((booking) => (
              <span key={`${booking.start}-${booking.end}`} className="block text-xs text-slate-600">
                Booked {minutesToLabel(booking.start)}–{minutesToLabel(booking.end)}
              </span>
            ))}
          </button>
        );
      })}
    </div>
  );
}
