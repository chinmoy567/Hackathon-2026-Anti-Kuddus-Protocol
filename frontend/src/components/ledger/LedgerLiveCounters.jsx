import { motion } from "framer-motion";

// Two hero figures side by side — the live-updating running totals pushed by
// ledger:updated. Proportional figures (not tabular-nums): these are
// standalone display values, not a column that must align.
export const LedgerLiveCounters = ({ cashTotal, foodTotal }) => (
  <div className="grid grid-cols-2 gap-4">
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-150 hover:shadow-md"
    >
      <p className="text-sm text-slate-500">Total cash extorted</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
        {cashTotal.toLocaleString()} <span className="text-lg font-normal text-slate-400">Taka</span>
      </p>
    </motion.div>
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-150 hover:shadow-md"
    >
      <p className="text-sm text-slate-500">Total tiffin items stolen</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
        {foodTotal.toLocaleString()} <span className="text-lg font-normal text-slate-400">items</span>
      </p>
    </motion.div>
  </div>
);
