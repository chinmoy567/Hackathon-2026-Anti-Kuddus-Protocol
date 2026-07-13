import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";

// Baseline search result — a plain rule card, deliberately undecorated (no verdict/badge
// styling, per task1 spec §5): that visual language is reserved for the Task 2 validation card.
export const RuleCard = ({ title, text }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-shadow duration-150 hover:shadow-md"
  >
    <h3 className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
      <BookMarked className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
      {title}
    </h3>
    <p className="text-sm text-slate-600">{text}</p>
  </motion.div>
);
