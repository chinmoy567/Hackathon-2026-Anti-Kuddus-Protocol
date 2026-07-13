import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading.jsx";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";
import { useCountUp } from "../../hooks/useCountUp.js";

const STATS = [
  { value: 3, suffix: "", label: "Strikes to impeachment", detail: "Validated reports, publicly tracked" },
  { value: 5, suffix: "", label: "Rescue zones covered", detail: "SOS works everywhere that matters" },
  { value: 2, prefix: "<", suffix: "s", label: "Alert delivery time", detail: "Flare to captain dashboard" },
  { value: 100, suffix: "%", label: "Reporter anonymity", detail: "Identity and reports never join" },
];

// Single stat tile with a scroll-triggered count-up number.
const StatTile = ({ value, prefix = "", suffix = "", label, detail }) => {
  const ref = useRef(null);
  const count = useCountUp(ref, value);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
    >
      <p className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
        {prefix}
        {count}
        {suffix}
      </p>
      <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </motion.div>
  );
};

// Impact numbers in a four-up responsive grid.
export const Stats = () => (
  <section id="impact" className="bg-slate-50 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Impact"
        title="Numbers a tyrant can't argue with"
        subtitle="The whole protocol runs on a few uncompromising guarantees."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
      >
        {STATS.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </motion.div>
    </div>
  </section>
);
