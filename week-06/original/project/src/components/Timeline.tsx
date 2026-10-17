import type { Room } from '@/lib/types';
import { minutesToLabel } from '@/lib/format';

interface Props {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
  available: boolean | null;
}

export default function Timeline({ room, candidateStart, candidateEnd, available }: Props) {
  const blocks = [...room.bookings.map((b) => ({ ...b, kind: 'booked' as const }))];
  if (candidateStart !== null && candidateEnd !== null) {
    blocks.push({
      id: 'candidate',
      start: candidateStart,
      end: candidateEnd,
      bookedBy: 'Your request',
      kind: 'candidate' as const,
    });
  }
  blocks.sort((a, b) => a.start - b.start);

  const hourMarkers = Array.from({ length: 25 }, (_, h) => h * 60);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Daily timeline — {room.name}
      </h3>
      <div className="mt-3">
        <div className="relative h-10 overflow-hidden rounded-lg bg-slate-100">
          {blocks.map((b) => {
            const left = (b.start / 1440) * 100;
            const width = ((b.end - b.start) / 1440) * 100;
            const bg =
              b.kind === 'candidate'
                ? available
                  ? 'bg-teal-400'
                  : 'bg-amber-400'
                : 'bg-slate-400';
            return (
              <div
                key={b.id}
                className={`absolute top-0 h-full ${bg} flex items-center justify-center text-[10px] font-medium text-white`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${minutesToLabel(b.start)}–${minutesToLabel(b.end)} ${b.bookedBy}`}
              >
                {width > 4 ? `${minutesToLabel(b.start)}` : ''}
              </div>
            );
          })}
        </div>
        <div className="relative mt-1 h-4 text-[9px] text-slate-400">
          {hourMarkers.map((m, i) =>
            i % 6 === 0 ? (
              <span
                key={m}
                className="absolute -translate-x-1/2"
                style={{ left: `${(m / 1440) * 100}%` }}
              >
                {minutesToLabel(m)}
              </span>
            ) : null
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-slate-400" /> Existing booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 rounded-sm ${available ? 'bg-teal-400' : 'bg-amber-400'}`} /> Your request
        </span>
      </div>
    </div>
  );
}
