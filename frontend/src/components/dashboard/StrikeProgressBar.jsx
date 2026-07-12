import { STRIKE_LIMIT } from "../../utils/constants.js";

// Warning states are never color-only — the numeric label always accompanies
// the fill color (Frontend.md §7 accessibility rules).
export const StrikeProgressBar = ({ strikeCount }) => {
  const segments = Array.from({ length: STRIKE_LIMIT });

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Warnings: {strikeCount}/{STRIKE_LIMIT}
      </h2>
      <div className="mt-3 flex gap-2">
        {segments.map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 rounded-full transition-colors duration-500 ease-out ${
              i < strikeCount ? "bg-amber-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {strikeCount} of {STRIKE_LIMIT} warnings recorded.
      </p>
    </div>
  );
};
