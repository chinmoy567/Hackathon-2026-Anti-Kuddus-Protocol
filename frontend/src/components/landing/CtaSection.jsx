import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";

// Full-width gradient call-to-action panel above the footer.
export const CtaSection = () => (
  <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-center shadow-2xl shadow-slate-400/30 sm:px-12 sm:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
      </div>

      <motion.span
        variants={fadeUp}
        className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
        Anonymous by design. Fair by default.
      </motion.span>

      <motion.h2
        variants={fadeUp}
        className="relative mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
      >
        The classroom is watching.
        <span className="block bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
          Make your voice count.
        </span>
      </motion.h2>

      <motion.p variants={fadeUp} className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400">
        Join the protocol today — report safely, respond instantly, and hold power
        accountable, one validated strike at a time.
      </motion.p>

      <motion.div variants={fadeUp} className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/login"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-rose-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Enter the Protocol
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
        <a
          href="#portals"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Explore the portals
        </a>
      </motion.div>
    </motion.div>
  </section>
);
