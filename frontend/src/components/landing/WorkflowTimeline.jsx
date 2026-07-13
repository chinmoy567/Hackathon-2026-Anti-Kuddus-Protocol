import { motion } from "framer-motion";
import { PenLine, ShieldQuestion, Gauge, Gavel } from "lucide-react";
import { SectionHeading } from "./SectionHeading.jsx";
import { fadeUp, staggerParent, viewportOnce } from "./motion.js";

const STEPS = [
  {
    icon: PenLine,
    step: "01",
    title: "Report anonymously",
    copy: "A student files a complaint or fires an SOS flare. No name, no trace — the identity vault and the report never touch.",
  },
  {
    icon: ShieldQuestion,
    step: "02",
    title: "Verify the claim",
    copy: "The fact-checker cross-references the school rulebook while the teacher reviews evidence in the triage queue.",
  },
  {
    icon: Gauge,
    step: "03",
    title: "Strike is recorded",
    copy: "Validated reports move the public warning meter. One strike, then two — everyone watches the pressure build.",
  },
  {
    icon: Gavel,
    step: "04",
    title: "Justice at strike three",
    copy: "The third validated strike triggers impeachment proceedings. Power returns to the classroom, fairly and on the record.",
  },
];

// Vertical timeline on mobile, four-column flow on desktop, with an amber progress rail.
export const WorkflowTimeline = () => (
  <section id="workflow" className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        dark
        eyebrow="How it works"
        title="From whisper to verdict in four steps"
        subtitle="A pipeline built on anonymity at the start and accountability at the end."
      />

      <motion.ol
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-8"
      >
        {/* Connector rail — vertical on mobile, horizontal across the top on desktop. */}
        <div
          aria-hidden="true"
          className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/60 via-rose-500/40 to-transparent lg:left-0 lg:right-0 lg:top-6 lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />

        {STEPS.map(({ icon: Icon, step, title, copy }) => (
          <motion.li key={step} variants={fadeUp} className="relative pl-16 lg:pl-0 lg:pt-16">
            <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-2xl border border-amber-400/30 bg-slate-900 text-amber-300 shadow-lg shadow-amber-500/10 transition-transform duration-300 hover:scale-110 lg:left-0">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-black tracking-[0.25em] text-amber-400/70">STEP {step}</p>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-white">{title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{copy}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  </section>
);
