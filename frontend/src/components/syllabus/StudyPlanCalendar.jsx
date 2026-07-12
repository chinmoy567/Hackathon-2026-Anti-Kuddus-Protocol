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

    <div className="space-y-4">
      {plan.map((day) => (
        <div key={day.date} className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">{day.date}</h3>
          <ul className="space-y-1.5">
            {day.blocks.map((block, index) => (
              <li
                key={`${block.topic}-${index}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="text-slate-700">{block.topic}</span>
                <span className="text-xs text-slate-500">
                  {block.startTime}–{block.endTime} ({block.durationMinutes} min)
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);
