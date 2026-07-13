import { ShieldAlert } from "lucide-react";

export const ImpeachedBanner = () => (
  <div
    role="status"
    aria-live="polite"
    className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-amber-50 p-6 text-center sm:p-8"
  >
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
      <ShieldAlert className="h-6 w-6" aria-hidden="true" />
    </span>
    <p className="mt-4 text-2xl font-bold tracking-tight text-rose-700">Kuddus Removed</p>
    <p className="mt-1 text-sm text-rose-600">Three validated strikes triggered impeachment.</p>
  </div>
);
