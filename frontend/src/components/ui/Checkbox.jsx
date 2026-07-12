import { forwardRef } from "react";

// Shared primitive for both plain checkboxes (accessibility priority) and
// radio-role single-select groups (the "is Kuddus" flag) — role/type are
// passed through by the caller.
export const Checkbox = forwardRef(({ label, id, className = "", ...props }, ref) => (
  <label htmlFor={id} className={`inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 ${className}`}>
    <input
      id={id}
      ref={ref}
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-slate-900 transition-colors
        focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
      {...props}
    />
    {label}
  </label>
));

Checkbox.displayName = "Checkbox";
