import { motion } from "framer-motion";
import {
  EyeOff,
  Armchair,
  BookOpenCheck,
  Coins,
  Flame,
  SearchCheck,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading.jsx";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";

const MISSIONS = [
  {
    icon: EyeOff,
    title: "Anonymous Whistleblower",
    copy: "Report incidents with zero identity trail. Three validated strikes trigger impeachment — the counter is public, the reporter never is.",
    tint: "bg-amber-50 text-amber-600",
  },
  {
    icon: Flame,
    title: "SOS Rescue Flare",
    copy: "A panic button that works from five key school zones, syncs offline, and hits the captain dashboard in under two seconds.",
    tint: "bg-rose-50 text-rose-600",
  },
  {
    icon: SearchCheck,
    title: "Fact-Checker",
    copy: "Any claim gets checked against the official school rulebook and returns TRUE or FALSE with the exact quote and a confidence score.",
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Armchair,
    title: "Anti-Camouflage Seat Planner",
    copy: "Height-sorted seating grids optimized for teacher line-of-sight, so no one can hide trouble behind a taller classmate.",
    tint: "bg-sky-50 text-sky-600",
  },
  {
    icon: BookOpenCheck,
    title: "Syllabus Negotiator",
    copy: "AI trims an impossible syllabus against the real curriculum and hands back a study plan you can actually finish.",
    tint: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Coins,
    title: "Tiffin Ledger",
    copy: "An anonymous economic ledger that charts every snack tax and toll, turning scattered grievances into undeniable data.",
    tint: "bg-orange-50 text-orange-600",
  },
];

// Six mission feature cards in a responsive grid with hover lift + icon micro-interactions.
export const Features = () => (
  <section id="missions" className="bg-white py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Six missions"
        title="Everything a classroom needs to fight back"
        subtitle="From silent reporting to instant rescue, each mission covers one way trouble shows up at school."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      >
        {MISSIONS.map(({ icon: Icon, title, copy, tint }) => (
          <motion.article
            key={title}
            variants={fadeUp}
            className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tint}`}>
              <Icon className="h-5.5 w-5.5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-base font-bold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{copy}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);
