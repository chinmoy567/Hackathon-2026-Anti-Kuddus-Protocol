import { useState, useMemo } from "react";
import { Card } from "../components/ui/Card.jsx";
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
    <Card className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">Syllabus Negotiator</h1>
      <p className="mb-6 text-sm text-slate-500">
        Paste Kuddus&apos;s syllabus announcement below to get a clean, bulleted list of topics.
      </p>

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
          <Button type="button" variant="secondary" onClick={handleTryExample} disabled={isLoading}>
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

      {data?.topics && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          {data.degraded && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              The AI service is temporarily unavailable, so this result may be incomplete or
              generic. Please try again shortly.
            </div>
          )}
          <h2 className="mb-3 text-sm font-medium text-slate-700">Topics</h2>
          {data.topics.length === 0 ? (
            <p className="text-sm text-slate-500">
              {data.degraded
                ? "No topics could be generated while the AI service is unavailable."
                : "No topics were extracted from this text."}
            </p>
          ) : (
            <ul className="space-y-2">
              {data.topics.map((topic, index) => (
                <li
                  key={`${topic}-${index}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800"
                >
                  {topic}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {filterData && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          {filterData.degraded && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              The AI service is temporarily unavailable, so this result may be incomplete.
              Please try again shortly.
            </div>
          )}

          <h2 className="mb-3 text-sm font-medium text-slate-700">Kept — matched against the curriculum</h2>
          {filterData.kept.length === 0 ? (
            <p className="mb-4 text-sm text-slate-500">No topics matched the curriculum.</p>
          ) : (
            <div className="mb-4 space-y-2">
              {filterData.kept.map((item, index) => (
                <KeptTopicCard key={`${item.topic}-${index}`} {...item} />
              ))}
            </div>
          )}

          <h2 className="mb-3 text-sm font-medium text-slate-700">Discarded — not examinable</h2>
          {filterData.discarded.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing was discarded.</p>
          ) : (
            <div className="space-y-2">
              {filterData.discarded.map((item, index) => (
                <DiscardedTopicRow key={`${item.topic}-${index}`} {...item} />
              ))}
            </div>
          )}

          {filterData.kept.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <h2 className="mb-3 text-sm font-medium text-slate-700">Generate Study Plan</h2>
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
                <div className="mt-6">
                  <StudyPlanCalendar
                    plan={planData.plan}
                    warning={planData.warning}
                    degraded={planData.degraded}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
