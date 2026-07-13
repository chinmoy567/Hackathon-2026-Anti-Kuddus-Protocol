import { motion } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

// Dark hero-style header shared across app pages, matching the landing page's visual language.
export const PageHeader = ({ icon: Icon, eyebrow, title, description, actions }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 shadow-xl shadow-slate-950/10 sm:p-8"
  >
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
    </div>
    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-300">
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm text-slate-400 sm:text-base">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  </motion.div>
);
