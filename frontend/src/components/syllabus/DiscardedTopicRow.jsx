import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

// Compact, muted strip for a topic the RAG filter discarded — visually distinct from kept
// topics so a judge can immediately see "barcode on the back cover — not found in curriculum"
// without hunting for it (task2 spec §5).
export const DiscardedTopicRow = ({ topic, reason }) => (
  <motion.div
    whileHover={{ opacity: 1 }}
    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 opacity-80 transition-opacity duration-150"
  >
    <span className="flex min-w-0 items-center gap-2">
      <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
      <span className="truncate text-sm text-slate-500 line-through decoration-slate-400">{topic}</span>
    </span>
    <span className="shrink-0 text-xs text-slate-400">{reason}</span>
  </motion.div>
);
