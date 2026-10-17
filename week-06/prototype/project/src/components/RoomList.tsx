import type { Room } from '@/lib/types';
import { minutesToLabel } from '@/lib/format';
import { Users, MapPin } from 'lucide-react';

interface Props {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelect: (id: string) => void;
  onToggleBlocked: (id: string) => void;
}

export default function RoomList({ rooms, selectedRoomId, onSelect, onToggleBlocked }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => {
        const selected = room.id === selectedRoomId;
        return (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={`text-left rounded-xl border p-4 transition-all duration-200 ${
              selected
                ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{room.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {room.building}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
              <Users className="h-3.5 w-3.5" /> {room.capacity} seats
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
              <span className={`text-xs font-medium ${room.blocked ? 'text-red-600' : 'text-emerald-600'}`}>
                {room.blocked ? 'Blocked' : 'Unblocked'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleBlocked(room.id); }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${room.blocked ? 'bg-red-400' : 'bg-emerald-400'}`}
                aria-label={`Toggle blocked status for ${room.name}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${room.blocked ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {room.bookings.length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-2">
                <p className="text-xs font-medium text-slate-400">Bookings</p>
                <ul className="mt-1 space-y-0.5">
                  {room.bookings.map((b) => (
                    <li key={b.id} className="text-xs text-slate-500">
                      {minutesToLabel(b.start)} – {minutesToLabel(b.end)} · {b.bookedBy}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
