import { motion } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { EASE_OUT } from "../../utils/motion.js";

// The mission's signature UI surface (task2 spec §5) — bold verdict badge, confidence meter,
// exact quote set apart as a blockquote. UNVERIFIABLE reads as distinctly neutral, not a washed
// -out FALSE, since it means "no matching rule found," not "the claim is false."
const VERDICT_STYLES = {
  TRUE: {
    badge: "bg-emerald-600 text-white",
    card: "border-emerald-200 bg-emerald-50",
    meter: "bg-emerald-600",
    label: "TRUE",
    icon: CheckCircle2,
  },
  FALSE: {
    badge: "bg-rose-600 text-white",
    card: "border-rose-200 bg-rose-50",
    meter: "bg-rose-600",
    label: "FALSE",
    icon: XCircle,
  },
  UNVERIFIABLE: {
    badge: "bg-slate-500 text-white",
    card: "border-slate-300 bg-slate-100",
    meter: "bg-slate-500",
    label: "UNVERIFIABLE",
    icon: HelpCircle,
  },
};

export const ValidationCard = ({ verdict, confidence, quote, ruleTitle }) => {
  const style = VERDICT_STYLES[verdict] ?? VERDICT_STYLES.UNVERIFIABLE;
  const Icon = style.icon;
  const confidencePercent = Math.round((confidence ?? 0) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`rounded-2xl border px-5 py-4 ${style.card}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold tracking-wide ${style.badge}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {style.label}
        </motion.span>
        <span className="text-xs font-medium text-slate-600">{confidencePercent}% confidence</span>
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: confidencePercent / 100 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
          style={{ transformOrigin: "left" }}
          className={`h-full rounded-full ${style.meter}`}
        />
      </div>

      {verdict === "UNVERIFIABLE" ? (
        <p className="text-sm text-slate-600">
          No matching rule was found in the official rulebook for this claim.
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <blockquote className="mb-2 border-l-2 border-slate-400 pl-3 text-sm italic text-slate-800">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {ruleTitle && <p className="text-xs text-slate-600">Source: {ruleTitle}</p>}
        </motion.div>
      )}
    </motion.div>
  );
};
