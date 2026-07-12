const VARIANTS = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 disabled:bg-slate-300",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600 disabled:bg-rose-300",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-600 disabled:bg-emerald-300",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400",
};

export const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
      transition-all duration-200 ease-out active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${VARIANTS[variant]} ${className}`}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    )}
    {children}
  </button>
);
