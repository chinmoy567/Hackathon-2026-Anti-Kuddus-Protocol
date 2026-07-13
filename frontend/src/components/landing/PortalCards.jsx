import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound, Megaphone, GraduationCap, ArrowUpRight, Check } from "lucide-react";
import { SectionHeading } from "./SectionHeading.jsx";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";

const PORTALS = [
  {
    icon: UserRound,
    name: "Student Portal",
    tagline: "Speak up without fear",
    accent: "from-amber-400 to-orange-500",
    ring: "hover:ring-amber-400/40",
    points: ["File complaints 100% anonymously", "One-tap SOS rescue flare", "AI syllabus negotiator & fact-checker"],
  },
  {
    icon: Megaphone,
    name: "Captain Portal",
    tagline: "First to every emergency",
    accent: "from-rose-500 to-red-600",
    ring: "hover:ring-rose-400/40",
    featured: true,
    points: ["Real-time SOS alert dashboard", "Live location of every flare", "Read-only oversight, zero bias"],
  },
  {
    icon: GraduationCap,
    name: "Teacher Portal",
    tagline: "Justice, delivered fairly",
    accent: "from-emerald-500 to-teal-600",
    ring: "hover:ring-emerald-400/40",
    points: ["Validate or reject every report", "Three-strike warning tracker", "Impeachment at strike three"],
  },
];

// Three role-portal cards; the captain card is visually elevated as the emergency hub.
export const PortalCards = () => (
  <section id="portals" className="relative bg-slate-50 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Three portals"
        title="One system, every role covered"
        subtitle="Students report, captains respond, teachers decide. Each portal shows exactly what that role needs — nothing more, nothing less."
      />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        {PORTALS.map(({ icon: Icon, name, tagline, accent, ring, points, featured }) => (
          <motion.article
            key={name}
            variants={fadeUp}
            className={`group relative flex flex-col rounded-3xl border bg-white p-7 shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${ring} ${
              featured
                ? "border-rose-200 shadow-lg shadow-rose-100 sm:col-span-2 lg:col-span-1"
                : "border-slate-200"
            }`}
          >
            {featured && (
              <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-rose-300">
                Emergency hub
              </span>
            )}

            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${accent}`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>

            <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{name}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{tagline}</p>

            <ul className="mt-5 flex-1 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <Link
              to="/login"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-lg"
            >
              Open portal
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </div>
  </section>
);
