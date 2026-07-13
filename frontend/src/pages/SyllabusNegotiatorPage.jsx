import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenCheck, ListChecks, Sparkles, CalendarRange } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { fadeUp, staggerParent, staggerItem } from "../utils/motion.js";
import { Button } from "../components/ui/Button.jsx";
import { TextArea } from "../components/ui/TextArea.jsx";
import { TextInput } from "../components/ui/TextInput.jsx";
import { Checkbox } from "../components/ui/Checkbox.jsx";
import { KeptTopicCard } from "../components/syllabus/KeptTopicCard.jsx";
import { DiscardedTopicRow } from "../components/syllabus/DiscardedTopicRow.jsx";
import { StudyPlanCalendar } from "../components/syllabus/StudyPlanCalendar.jsx";
import {
  useSummarizeSyllabusMutation,
  useFilterSyllabusMutation,
  useGenerateStudyPlanMutation,
} from "../store/apiSlice.js";
import { SYLLABUS_TEXT_MAX_LENGTH, DEMO_SYLLABUS_TEXT } from "../utils/constants.js";

const tomorrowIsoDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const SyllabusNegotiatorPage = () => {
  const [syllabusText, setSyllabusText] = useState("");
  const [summarize, { data, isLoading, isError, error }] = useSummarizeSyllabusMutation();
  const [filterCurriculum, { data: filterData, isLoading: isFiltering, isError: isFilterError, error: filterError }] =
    useFilterSyllabusMutation();
  const [generatePlan, { data: planData, isLoading: isPlanning, isError: isPlanError, error: planError }] =
    useGenerateStudyPlanMutation();

  const [testDate, setTestDate] = useState(tomorrowIsoDate());
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [selectedWeakSubjects, setSelectedWeakSubjects] = useState([]);

  const isOverLimit = syllabusText.length > SYLLABUS_TEXT_MAX_LENGTH;
  const isEmpty = syllabusText.trim().length === 0;

  const keptSubjects = useMemo(
    () => [...new Set((filterData?.kept ?? []).map((item) => item.subject).filter(Boolean))],
    [filterData]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmpty || isOverLimit) return;
    summarize(syllabusText);
  };

  const handleFilter = () => {
    if (isEmpty || isOverLimit) return;
    filterCurriculum(syllabusText);
  };

  const handleTryExample = () => setSyllabusText(DEMO_SYLLABUS_TEXT);

  const handleGeneratePlan = () => {
    const topics = (filterData?.kept ?? []).map((item) => item.topic);
    if (topics.length === 0 || !testDate) return;
    generatePlan({ topics, testDate, hoursPerDay: Number(hoursPerDay), weakSubjects: selectedWeakSubjects });
  };

  const toggleWeakSubject = (subject) => {
    setSelectedWeakSubjects((current) =>
      current.includes(subject) ? current.filter((s) => s !== subject) : [...current, subject]
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
      <PageHeader
        icon={BookOpenCheck}
        eyebrow="Syllabus Negotiator"
        title="Syllabus Negotiator"
        description="Paste Kuddus's syllabus announcement below to get a clean, bulleted list of topics."
      />
      <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          id="syllabusText"
          label="Syllabus text"
          rows={8}
          maxLength={SYLLABUS_TEXT_MAX_LENGTH}
          currentLength={syllabusText.length}
          value={syllabusText}
          onChange={(event) => setSyllabusText(event.target.value)}
          placeholder="Paste the syllabus announcement here..."
          error={isOverLimit ? "Text is too long." : null}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={isEmpty || isOverLimit} loading={isLoading}>
            Summarize
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleFilter}
            disabled={isEmpty || isOverLimit}
            loading={isFiltering}
          >
            Filter Against Curriculum
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleTryExample}
            disabled={isLoading}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Try Kuddus&apos;s example syllabus
          </Button>
        </div>

        {isError && (
          <p className="text-sm text-rose-600">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        )}
        {isFilterError && (
          <p className="text-sm text-rose-600">
            {filterError?.message || "Something went wrong. Please try again."}
          </p>
        )}
      </form>

      <AnimatePresence>
        {data?.topics && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 border-t border-slate-200 pt-6"
          >
            {data.degraded && (
              <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                The AI service is temporarily unavailable, so this result may be incomplete or
                generic. Please try again shortly.
              </div>
            )}
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ListChecks className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Topics
            </h2>
            {data.topics.length === 0 ? (
              <p className="text-sm text-slate-500">
                {data.degraded
                  ? "No topics could be generated while the AI service is unavailable."
                  : "No topics were extracted from this text."}
              </p>
            ) : (
              <motion.ul className="space-y-2" initial="hidden" animate="visible" variants={staggerParent}>
                {data.topics.map((topic, index) => (
                  <motion.li
                    key={`${topic}-${index}`}
                    variants={staggerItem}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800"
                  >
                    {topic}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filterData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 border-t border-slate-200 pt-6"
          >
          {filterData.degraded && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              The AI service is temporarily unavailable, so this result may be incomplete.
              Please try again shortly.
            </div>
          )}

          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <ListChecks className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            Kept — matched against the curriculum
          </h2>
          {filterData.kept.length === 0 ? (
            <p className="mb-4 text-sm text-slate-500">No topics matched the curriculum.</p>
          ) : (
            <motion.div className="mb-4 space-y-2" initial="hidden" animate="visible" variants={staggerParent}>
              {filterData.kept.map((item, index) => (
                <motion.div key={`${item.topic}-${index}`} variants={staggerItem}>
                  <KeptTopicCard {...item} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <h2 className="mb-3 text-sm font-medium text-slate-700">Discarded — not examinable</h2>
          {filterData.discarded.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing was discarded.</p>
          ) : (
            <motion.div className="space-y-2" initial="hidden" animate="visible" variants={staggerParent}>
              {filterData.discarded.map((item, index) => (
                <motion.div key={`${item.topic}-${index}`} variants={staggerItem}>
                  <DiscardedTopicRow {...item} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {filterData.kept.length > 0 && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <CalendarRange className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Generate Study Plan
              </h2>
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput
                  id="testDate"
                  type="date"
                  label="Test date"
                  min={tomorrowIsoDate()}
                  value={testDate}
                  onChange={(event) => setTestDate(event.target.value)}
                />
                <TextInput
                  id="hoursPerDay"
                  type="number"
                  min={1}
                  max={16}
                  label="Hours per day"
                  value={hoursPerDay}
                  onChange={(event) => setHoursPerDay(event.target.value)}
                />
              </div>

              {keptSubjects.length > 0 && (
                <div className="mb-4">
                  <p className="mb-1.5 text-sm font-medium text-slate-700">Weak subjects (optional)</p>
                  <div className="flex flex-wrap gap-4">
                    {keptSubjects.map((subject) => (
                      <Checkbox
                        key={subject}
                        id={`weak-${subject}`}
                        label={subject}
                        checked={selectedWeakSubjects.includes(subject)}
                        onChange={() => toggleWeakSubject(subject)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button type="button" onClick={handleGeneratePlan} loading={isPlanning} disabled={!testDate}>
                Generate Study Plan
              </Button>

              {isPlanError && (
                <p className="mt-3 text-sm text-rose-600">
                  {planError?.message || "Something went wrong. Please try again."}
                </p>
              )}

              {planData?.plan && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <StudyPlanCalendar
                    plan={planData.plan}
                    warning={planData.warning}
                    degraded={planData.degraded}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
      </Card>
    </div>
  );
};
