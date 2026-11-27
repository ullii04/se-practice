import { useState } from 'react';
import { explainAvailability, mockAdapter, type ExplanationInput, type ExplanationResult } from '../explain';

export default function ExplanationPanel({ input }: { input: ExplanationInput }) {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ExplanationResult>();
  const [invalidInput, setInvalidInput] = useState(false);

  async function explain() {
    setPending(true);
    setResult(undefined);
    setInvalidInput(false);
    const adapter = simulateFailure
      ? async () => { throw new Error('Simulated adapter failure.'); }
      : mockAdapter;

    try {
      setResult(await explainAvailability(input, adapter));
    } catch {
      setInvalidInput(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={pending} onClick={explain}
          className="rounded-lg border border-teal-600 px-4 py-2 font-medium text-teal-800 disabled:opacity-50">
          {pending ? 'Preparing explanation…' : 'Explain availability'}
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" disabled={pending} checked={simulateFailure}
            onChange={(event) => { setSimulateFailure(event.target.checked); setResult(undefined); }} />
          Simulate API failure
        </label>
      </div>
      <div aria-live="polite">
        {invalidInput && <p className="mt-3 text-sm">Explanation unavailable for this input.</p>}
        {result && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <p className="text-sm font-semibold text-slate-700">
              {result.source === 'generated' ? 'Generated explanation (mock)' : 'Fallback explanation (local rules)'}
            </p>
            <p className="text-sm text-slate-600">{result.explanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
