import { forwardRef } from "react";

export const Select = forwardRef(({ label, error, id, options, placeholder, className = "", ...props }, ref) => (
  <div className={className}>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <select
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm
        transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
        ${error ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:border-slate-400 focus:ring-slate-300"}`}
      defaultValue=""
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-600">
        {error}
      </p>
    )}
  </div>
));

Select.displayName = "Select";
