import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// Citation card for a topic the RAG filter kept — shows the grounding evidence (sourceRef,
// justification) rather than a bare LLM assertion, per task2 spec's "every AI-derived decision
// must be grounded and visible" rule.
export const KeptTopicCard = ({ topic, justification, sourceRef, courseCode, examFrequency, examsAvailable }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition-shadow duration-150 hover:shadow-md"
  >
    <div className="mb-1 flex flex-wrap items-center gap-2">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      <span className="text-sm font-medium text-emerald-900">{topic}</span>
      {courseCode && (
        <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-800">
          {courseCode}
        </span>
      )}
      {examsAvailable > 0 && (
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-300">
          Tested in {examFrequency} of {examsAvailable} past exams
        </span>
      )}
    </div>
    {justification && <p className="mb-1 pl-6 text-xs italic text-emerald-800">&ldquo;{justification}&rdquo;</p>}
    {sourceRef && <p className="pl-6 text-xs text-emerald-600">Source: {sourceRef}</p>}
  </motion.div>
);
