import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, MapPin, BellRing, Radio } from "lucide-react";
import { fadeUp, staggerParent, EASE_OUT } from "./motion.js";

// Immersive dark hero: headline + CTAs on the left, live SOS console mock on the right.
export const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-slate-950">
    {/* Layered radial glows + faint grid keep the dark canvas from feeling flat. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-rose-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]" />
    </div>

    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-40 lg:px-8">
      <motion.div variants={staggerParent} initial="hidden" animate="visible">
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-300"
        >
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Class 7B · Emergency Response Network
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          When trouble strikes,
          <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400 bg-clip-text text-transparent">
            help is one tap away.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          A school emergency SOS system built for students, by students. Report incidents
          anonymously, fire a rescue flare from anywhere in school, and let captains and
          teachers respond in real time — identity protected, always.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/login"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-rose-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-rose-500/35 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Launch a Rescue Flare
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <a
            href="#workflow"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-8 flex items-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Captain dashboard live · zero identities exposed since day one
        </motion.p>
      </motion.div>

      {/* SOS console mock — glass cards floating over a pulsing panic button. */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
        aria-hidden="true"
        className="relative mx-auto w-full max-w-md lg:max-w-none"
      >
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">SOS Console</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
              <Radio className="h-3 w-3" /> Live
            </span>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="relative grid h-36 w-36 place-items-center sm:h-40 sm:w-40">
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/20 [animation-duration:2s]" />
              <span className="absolute inset-3 rounded-full bg-rose-500/10" />
              <div className="relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-xl shadow-rose-600/40 ring-4 ring-rose-500/30 sm:h-28 sm:w-28">
                <span className="text-lg font-black tracking-widest">SOS</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE_OUT }}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-400">
              <BellRing className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Flare received — Tiffin Room</p>
              <p className="text-xs text-slate-400">Anonymous student · 4 seconds ago</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.15, ease: EASE_OUT }}
            className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
              <MapPin className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Captain Biltu responding</p>
              <p className="text-xs text-slate-400">ETA 40 seconds · corridor B</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);
