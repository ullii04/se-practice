import { CheckCircle2, XCircle } from 'lucide-react';
import type { AvailabilityResult } from '@/lib/types';

interface Props {
  result: AvailabilityResult | null;
}

export default function ResultBanner({ result }: Props) {
  if (!result) return null;

  if (result.available) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-teal-600" />
        <div>
          <p className="font-semibold text-teal-800">Available</p>
          <p className="text-sm text-teal-600">This time slot is open and can be booked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
      <div>
        <p className="font-semibold text-red-800">Unavailable</p>
        <p className="text-sm text-red-600">{result.reason}</p>
      </div>
    </div>
  );
}
