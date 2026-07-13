export const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-8 ${className}`}>
    {children}
  </div>
);
