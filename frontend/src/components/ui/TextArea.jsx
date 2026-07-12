import { forwardRef } from "react";

export const TextArea = forwardRef(
  ({ label, error, id, maxLength, currentLength, rows = 5, className = "", ...props }, ref) => (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-slate-400">
            {currentLength ?? 0}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm
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
  )
);

TextArea.displayName = "TextArea";
