// Baseline search result — a plain rule card, deliberately undecorated (no verdict/badge
// styling, per task1 spec §5): that visual language is reserved for the Task 2 validation card.
export const RuleCard = ({ title, text }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <h3 className="mb-1 text-sm font-medium text-slate-900">{title}</h3>
    <p className="text-sm text-slate-600">{text}</p>
  </div>
);
