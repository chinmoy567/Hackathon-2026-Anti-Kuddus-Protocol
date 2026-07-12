// Compact, muted strip for a topic the RAG filter discarded — visually distinct from kept
// topics so a judge can immediately see "barcode on the back cover — not found in curriculum"
// without hunting for it (task2 spec §5).
export const DiscardedTopicRow = ({ topic, reason }) => (
  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
    <span className="text-sm text-slate-500 line-through decoration-slate-400">{topic}</span>
    <span className="text-xs text-slate-400">{reason}</span>
  </div>
);
