import { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { rooms as sampleRooms } from '@/lib/sampleData';
import { checkAvailability } from '@/lib/validation';
import { minutesToLabel, CURRENT_TIME } from '@/lib/format';
import type { AvailabilityResult } from '@/lib/types';
import RoomList from '@/components/RoomList';
import Timeline from '@/components/Timeline';
import ResultBanner from '@/components/ResultBanner';

function App() {
  const [rooms, setRooms] = useState(sampleRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(sampleRooms[0].id);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;

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

  function handleCheck() {
    if (!selectedRoom) {
      setResult({ available: false, reason: 'Please select a room.' });
      return;
    }
    const s = parseTimeToMinutes(startStr);
    const e = parseTimeToMinutes(endStr);
    if (s === null || e === null) {
      setResult({ available: false, reason: 'Please enter valid times in HH:MM format.' });
      return;
    }
    setResult(checkAvailability(selectedRoom, s, e, CURRENT_TIME));
  }

  function handleReset() {
    setStartStr('');
    setEndStr('');
    setResult(null);
  }

  function toggleBlocked(roomId: string) {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, blocked: !r.blocked } : r))
    );
    setResult(null);
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
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Select a room
          </h2>
          <RoomList rooms={rooms} selectedRoomId={selectedRoomId} onSelect={setSelectedRoomId} onToggleBlocked={toggleBlocked} />
        </section>

        {selectedRoom && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Check a time slot
              </h2>
              <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={startStr}
                    onChange={(e) => setStartStr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="HH:MM"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End time
                  </label>
                  <input
                    type="time"
                    value={endStr}
                    onChange={(e) => setEndStr(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="HH:MM"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCheck}
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

            {result && <ResultBanner result={result} />}
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
