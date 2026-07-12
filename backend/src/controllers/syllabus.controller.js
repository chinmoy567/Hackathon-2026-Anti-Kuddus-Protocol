import * as syllabusService from "../services/syllabus.service.js";
import * as studyPlanService from "../services/studyPlan.service.js";
import { CurriculumTopic } from "../models/domain/curriculumTopic.model.js";
import { env } from "../config/env.js";
import { success } from "../utils/apiResponse.js";
import { TestDateMustBeFutureError } from "../utils/errors.js";

// Auth: any authenticated role (API.md §9).
export const summarize = async (req, res) => {
  const { syllabusText } = req.body;
  const { topics, degraded } = await syllabusService.summarize(syllabusText);
  success(res, { statusCode: 200, data: { topics, degraded } });
};

// Auth: any authenticated role (API.md §9, advanced — RAG).
export const filter = async (req, res) => {
  const { syllabusText } = req.body;
  const { kept, discarded, degraded } = await syllabusService.filter(syllabusText);
  success(res, { statusCode: 200, data: { kept, discarded, degraded } });
};

// Auth: any authenticated role (API.md §9, advanced — structured study plan).
export const studyPlan = async (req, res) => {
  const { topics, testDate, hoursPerDay, weakSubjects } = req.body;

  // Distinct 400 TEST_DATE_MUST_BE_FUTURE error code (checked here, not in express-validator —
  // see syllabus.validation.js for why).
  if (new Date(testDate).getTime() <= Date.now()) {
    throw new TestDateMustBeFutureError();
  }

  const daysUntilTest = Math.max(
    1,
    Math.ceil((new Date(testDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  );
  const effectiveHoursPerDay = hoursPerDay ?? env.studyPlan.defaultHoursPerDay;

  // Resolve the client's bare topics:string[] against curriculum_topics by exact topicText
  // match to recover subject/examFrequency/examsAvailable (task3 plan §4). A topic string with
  // no match (e.g. manually-typed, not in the corpus) is still schedulable — just ineligible
  // for the weak-subject/exam-frequency weighting signals.
  const curriculumDocs = await CurriculumTopic.find({ topicText: { $in: topics } });
  const docsByTopicText = new Map(curriculumDocs.map((doc) => [doc.topicText, doc]));

  const richTopics = topics.map((topic) => {
    const doc = docsByTopicText.get(topic);
    return {
      topic,
      subject: doc?.subject ?? null,
      examFrequency: doc?.examFrequency ?? 0,
      examsAvailable: doc?.examsAvailable ?? 1,
    };
  });

  const { allocations, warning } = studyPlanService.computeWeightedAllocation(richTopics, {
    hoursPerDay: effectiveHoursPerDay,
    weakSubjects,
    daysUntilTest,
  });

  const { plan, degraded } = await studyPlanService.generatePlan(allocations, {
    testDate,
    hoursPerDay: effectiveHoursPerDay,
  });

  success(res, { statusCode: 200, data: { plan, degraded, ...(warning && { warning }) } });
};
