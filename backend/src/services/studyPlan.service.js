import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.js";
import { STUDY_PLAN_JSON_SCHEMA, validatePlanShape } from "../utils/studyPlanShape.js";

// Pure, deterministic, no LLM/network call — fully unit-testable in isolation
// (task3 plan §3.2). Takes Task 2's richer kept-topic objects
// { topic, subject, examFrequency, examsAvailable }, resolved by the controller from the
// client's bare topics:string[] (task3 plan §4).
export const computeWeightedAllocation = (topics, { hoursPerDay, weakSubjects = [], daysUntilTest }) => {
  const totalMinutesAvailable = hoursPerDay * 60 * daysUntilTest;

  if (topics.length === 0) {
    return { allocations: [], totalMinutesAvailable, warning: null };
  }

  const baseAllocation = totalMinutesAvailable / topics.length;

  const rawAllocations = topics.map((topic) => {
    let minutes = baseAllocation;

    // Weak-subject boost — subject is a genuine, distinct value now that the corpus spans
    // two real courses (task3 spec/plan: no "weak modules" workaround needed).
    if (topic.subject && weakSubjects.includes(topic.subject)) {
      minutes *= env.studyPlan.weakSubjectMultiplier;
    }

    // Exam-frequency nudge — ratio, not raw count, so a 1-exam course (CSE-301) and a
    // 2-exam course (CSE-201) are compared fairly (task3 plan §3.2 step 5).
    const examsAvailable = topic.examsAvailable ?? 0;
    if (examsAvailable > 0) {
      const ratio = (topic.examFrequency ?? 0) / examsAvailable;
      if (ratio === 1) {
        minutes *= env.studyPlan.examFrequencyNudgeMultiplier;
      }
    }

    return { topic: topic.topic, minutes };
  });

  // Renormalize so the total still equals totalMinutesAvailable exactly, not just "close to".
  const rawTotal = rawAllocations.reduce((sum, a) => sum + a.minutes, 0);
  const scale = rawTotal > 0 ? totalMinutesAvailable / rawTotal : 0;
  let allocations = rawAllocations.map((a) => ({ topic: a.topic, minutes: a.minutes * scale }));

  // Absurd-input edge case (task3 plan §3.2 step 7) — too many topics for too little time
  // produces degenerate near-zero blocks. Merge the smallest allocations into shared blocks
  // instead of silently producing unusable schedules.
  let warning = null;
  const minBlock = env.studyPlan.minBlockMinutes;
  if (allocations.some((a) => a.minutes < minBlock) && allocations.length > 1) {
    allocations = mergeSmallAllocations(allocations, minBlock);
    warning = "Not enough time before the test to cover every topic individually; some topics have been grouped.";
  }

  return { allocations, totalMinutesAvailable, warning };
};

// Merges the smallest allocations pairwise (each merge sums their minutes) until every
// allocation is >= minBlock, or only one allocation remains. Total minutes is preserved
// exactly — nothing is silently dropped.
const mergeSmallAllocations = (allocations, minBlock) => {
  let result = [...allocations];

  while (result.length > 1 && result.some((a) => a.minutes < minBlock)) {
    result.sort((a, b) => a.minutes - b.minutes);
    const [smallest, secondSmallest, ...rest] = result;
    const merged = {
      topic: `${smallest.topic} + ${secondSmallest.topic}`,
      minutes: smallest.minutes + secondSmallest.minutes,
    };
    result = [merged, ...rest];
  }

  return result;
};

const DAY_START_HOUR = 18; // arbitrary fixed demo-friendly start time (task3 plan §3.2)

const formatTime = (totalMinutesFromMidnight) => {
  const hours = Math.floor(totalMinutesFromMidnight / 60) % 24;
  const minutes = Math.floor(totalMinutesFromMidnight % 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const addDays = (isoDate, days) => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

// Pure fallback plan builder — no LLM, always schema-valid by construction (task3 plan §3.2).
// Walks the date range day-by-day, placing each topic's allocated minutes into a single
// sequential block per day, wrapping to the next day when the day's hoursPerDay budget is
// exhausted. This is the AI Gateway D4 fallback principle applied to Task 3.
export const buildDeterministicPlan = (allocations, { testDate, hoursPerDay }) => {
  const today = new Date().toISOString().slice(0, 10);
  const dailyBudgetMinutes = hoursPerDay * 60;

  const plan = [];
  let dayIndex = 0;
  let minutesUsedToday = 0;
  let currentDayBlocks = [];

  const flushDay = () => {
    if (currentDayBlocks.length > 0) {
      plan.push({ date: addDays(today, dayIndex), blocks: currentDayBlocks });
    }
    currentDayBlocks = [];
    minutesUsedToday = 0;
    dayIndex += 1;
  };

  for (const allocation of allocations) {
    // Skip allocations that round to zero minutes rather than emitting a degenerate
    // zero-duration block (schema requires durationMinutes > 0).
    if (Math.round(allocation.minutes) <= 0) continue;

    let remaining = allocation.minutes;

    while (remaining > 0) {
      if (minutesUsedToday >= dailyBudgetMinutes) {
        flushDay();
      }

      const available = dailyBudgetMinutes - minutesUsedToday;
      const blockMinutes = Math.min(remaining, available);
      const startMinutes = DAY_START_HOUR * 60 + minutesUsedToday;

      currentDayBlocks.push({
        topic: allocation.topic,
        startTime: formatTime(startMinutes),
        endTime: formatTime(startMinutes + blockMinutes),
        durationMinutes: Math.round(blockMinutes),
      });

      minutesUsedToday += blockMinutes;
      remaining -= blockMinutes;
    }
  }
  flushDay();

  return { plan };
};

const PLAN_SYSTEM_PROMPT = `You are a scheduling assistant. Given a list of topics with a pre-computed minute budget each, and a date range, arrange the topics into a day-by-day study calendar.

Rules:
- Use exactly the provided per-topic minute budgets — do not add, remove, or re-weight topics. Your job is calendar placement only.
- Spread topics across the available days between today and the test date; do not cram everything into one day if multiple days are available.
- Every block's durationMinutes must be a positive number and its time range (startTime to endTime) must match that duration.
- Output must conform exactly to the provided JSON schema.`;

const buildPlanUserPrompt = (allocations, testDate) =>
  `Test date: ${testDate}\n\nTopics and their minute budgets:\n${allocations
    .map((a) => `- ${a.topic}: ${Math.round(a.minutes)} minutes`)
    .join("\n")}`;

// LangChain structured-output chain (task3 plan §2/§3.2) — the strongest justification for
// LangChain in this mission: withStructuredOutput() + retry-once handles the "reliably
// structured JSON" requirement (API.md §9) directly, rather than hand-rolled JSON.parse/catch.
// Falls back to buildDeterministicPlan() (pure, no LLM) if the LLM fails or produces
// malformed output twice — the AI Gateway D4 fallback principle applied to Task 3.
export const generatePlan = async (allocations, { testDate, hoursPerDay }) => {
  // Groq's API is OpenAI-compatible, so ChatOpenAI works against it via configuration/
  // baseURL — same free-tier chat provider as aiGateway.service.js#chat() (see there for the
  // provider-switch rationale).
  const model = new ChatOpenAI({
    model: env.gorqStructuredOutputModel,
    apiKey: env.gorqApiKey,
    configuration: { baseURL: "https://api.groq.com/openai/v1" },
  }).withStructuredOutput(STUDY_PLAN_JSON_SCHEMA);

  const attempt = async (correctiveContext) => {
    const userPrompt = buildPlanUserPrompt(allocations, testDate) + (correctiveContext ?? "");
    return model.invoke([
      { role: "system", content: PLAN_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);
  };

  try {
    const first = await attempt();
    const firstCheck = validatePlanShape(first);
    if (firstCheck.valid) return { ...first, degraded: false };

    const second = await attempt(
      `\n\nYour previous response was invalid: ${firstCheck.errors.join("; ")}. Correct it and respond again, conforming exactly to the schema.`
    );
    const secondCheck = validatePlanShape(second);
    if (secondCheck.valid) return { ...second, degraded: false };

    return { ...buildDeterministicPlan(allocations, { testDate, hoursPerDay }), degraded: true };
  } catch {
    // Any provider/network failure (LangChain wraps OpenAI errors in its own shape, not
    // AiProviderError) falls back to the deterministic plan — never a raw 5xx for a
    // study-plan request (D4 fallback principle).
    return { ...buildDeterministicPlan(allocations, { testDate, hoursPerDay }), degraded: true };
  }
};
