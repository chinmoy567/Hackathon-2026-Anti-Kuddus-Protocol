import { motion } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";

// Reusable eyebrow + title + subtitle block, animated on scroll into view.
export const SectionHeading = ({ eyebrow, title, subtitle, dark = false, className = "" }) => (
  <motion.div
    variants={staggerParent}
    initial="hidden"
    whileInView="visible"
    viewport={viewportOnce}
    className={`mx-auto max-w-2xl text-center ${className}`}
  >
    <motion.p
      variants={fadeUp}
      className={`text-xs font-bold uppercase tracking-[0.2em] ${dark ? "text-amber-300" : "text-rose-500"}`}
    >
      {eyebrow}
    </motion.p>
    <motion.h2
      variants={fadeUp}
      className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-slate-900"}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        variants={fadeUp}
        className={`mt-4 text-base leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);
