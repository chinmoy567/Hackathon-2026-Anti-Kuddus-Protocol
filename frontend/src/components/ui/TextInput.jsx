import { forwardRef } from "react";

export const TextInput = forwardRef(({ label, error, id, className = "", ...props }, ref) => (
  <div className={className}>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    <input
      id={id}
      ref={ref}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm
        transition-colors duration-150 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${error ? "border-rose-400 focus:ring-rose-400" : "border-slate-300 focus:border-slate-400 focus:ring-slate-300"}`}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-600">
        {error}
      </p>
    )}
  </div>
));

TextInput.displayName = "TextInput";
