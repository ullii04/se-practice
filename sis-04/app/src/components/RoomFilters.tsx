interface Props {
  attendees: string;
  equipment: string[];
  options: string[];
  onAttendeesChange: (value: string) => void;
  onEquipmentToggle: (item: string) => void;
}

export default function RoomFilters({ attendees, equipment, options, onAttendeesChange, onEquipmentToggle }: Props) {
  return (
    <section aria-labelledby="filters-heading" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 id="filters-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Room filters
      </h2>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="attendees" className="mb-1 block text-sm font-medium text-slate-700">Attendees</label>
          <input
            id="attendees"
            type="number"
            min="0"
            placeholder="Any size"
            value={attendees}
            onChange={(event) => onAttendeesChange(event.target.value)}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Required equipment</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {options.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={equipment.includes(item)}
                  onChange={() => onEquipmentToggle(item)}
                  className="accent-teal-600"
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
