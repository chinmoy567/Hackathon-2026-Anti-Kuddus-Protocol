import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { staggerParent, staggerItem } from "../../utils/motion.js";

// Day-by-day block view for a generated study plan (task3 spec §5).
export const StudyPlanCalendar = ({ plan, warning, degraded }) => (
  <div>
    {degraded && (
      <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        The AI service is temporarily unavailable, so this plan was generated with a
        simplified fallback schedule.
      </div>
    )}
    {warning && (
      <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {warning}
      </div>
    )}

    <motion.div className="space-y-4" initial="hidden" animate="visible" variants={staggerParent}>
      {plan.map((day) => (
        <motion.div
          key={day.date}
          variants={staggerItem}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-200 p-4 transition-shadow duration-150 hover:shadow-md"
        >
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CalendarDays className="h-4 w-4 text-amber-500" aria-hidden="true" />
            {day.date}
          </h3>
          <ul className="space-y-1.5">
            {day.blocks.map((block, index) => (
              <li
                key={`${block.topic}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm transition-colors duration-150 hover:bg-slate-100"
              >
                <span className="min-w-0 truncate text-slate-700">{block.topic}</span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {block.startTime}–{block.endTime} ({block.durationMinutes} min)
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  </div>
);
