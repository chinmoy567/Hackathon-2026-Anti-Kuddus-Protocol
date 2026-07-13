import { motion } from "framer-motion";
import { STRIKE_LIMIT } from "../../utils/constants.js";
import { EASE_OUT } from "../../utils/motion.js";

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
          <div key={i} className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200">
            {i < strikeCount && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
                style={{ transformOrigin: "left" }}
                className="h-full w-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
              />
            )}
          </div>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {strikeCount} of {STRIKE_LIMIT} warnings recorded.
      </p>
    </div>
  );
};
