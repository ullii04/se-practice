import { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { ROOMS } from './rooms';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { minutesToLabel, CURRENT_TIME } from '@/lib/format';
import RoomList from '@/components/RoomList';
import Timeline from '@/components/Timeline';
import ResultBanner, { type AvailabilityResult } from '@/components/ResultBanner';
import RoomFilters from '@/components/RoomFilters';

const equipmentOptions = [...new Set(ROOMS.flatMap((room) => room.equipment))].sort();

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [attendees, setAttendees] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [checked, setChecked] = useState(false);

  const matches = filterRooms(ROOMS, { attendees: Number(attendees), equipment });
  const selectedRoom = matches.find((room) => room.id === selectedRoomId) ?? matches[0];

  function parseTimeToMinutes(value: string): number | null {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
    if (!match) return null;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
  }

  const candidateStart = startStr ? parseTimeToMinutes(startStr) : null;
  const candidateEnd = endStr ? parseTimeToMinutes(endStr) : null;

  let result: AvailabilityResult | null = null;
  if (checked && selectedRoom) {
    if (candidateStart === null || candidateEnd === null) {
      result = { available: false, reason: 'Enter valid start and end times.' };
    } else {
      const available = checkRoom(matches, selectedRoom.id, {
        start: candidateStart, end: candidateEnd, now: CURRENT_TIME,
      });
      result = available ? { available: true } : {
        available: false,
        reason: 'This room cannot be booked for the selected time. Try a different time or room.',
      };
    }
  }

  function handleReset() {
    setStartStr('');
    setEndStr('');
    setChecked(false);
  }

  function toggleEquipment(item: string) {
    setEquipment((current) => current.includes(item)
      ? current.filter((selected) => selected !== item)
      : [...current, item]);
    setChecked(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Smart Campus Room Availability</h1>
              <p className="text-sm text-slate-500">
                Current time: {minutesToLabel(CURRENT_TIME)} · Check if a room is free
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <RoomFilters
          attendees={attendees}
          equipment={equipment}
          options={equipmentOptions}
          onAttendeesChange={(value) => { setAttendees(value); setChecked(false); }}
          onEquipmentToggle={toggleEquipment}
        />
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Matching rooms
          </h2>
          <RoomList rooms={matches} selectedRoomId={selectedRoom?.id} onSelect={setSelectedRoomId} />
        </section>

        {selectedRoom && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Check a time slot
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
                <div>
                  <label htmlFor="slot-start" className="mb-1 block text-sm font-medium text-slate-700">
                    Start time
                  </label>
                  <input
                    id="slot-start"
                    type="time"
                    value={startStr}
                    onChange={(e) => { setStartStr(e.target.value); setChecked(false); }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="HH:MM"
                  />
                </div>
                <div>
                  <label htmlFor="slot-end" className="mb-1 block text-sm font-medium text-slate-700">
                    End time
                  </label>
                  <input
                    id="slot-end"
                    type="time"
                    value={endStr}
                    onChange={(e) => { setEndStr(e.target.value); setChecked(false); }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="HH:MM"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChecked(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Check
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Times are in 24-hour format. Max booking length is 120 minutes. Start must be after
                the current time ({minutesToLabel(CURRENT_TIME)}).
              </p>
            </section>

            <Timeline
              room={selectedRoom}
              candidateStart={candidateStart}
              candidateEnd={candidateEnd}
              available={result?.available ?? null}
            />

            <div aria-live="polite"><ResultBanner result={result} /></div>
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Fictional sample data — for demonstration only.
      </footer>
    </div>
  );
}

export default App;
