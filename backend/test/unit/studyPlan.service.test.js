import { describe, it, expect } from "vitest";
import { computeWeightedAllocation, buildDeterministicPlan } from "../../src/services/studyPlan.service.js";
import { validatePlanShape } from "../../src/utils/studyPlanShape.js";

const topic = (overrides = {}) => ({
  topic: "Sample Topic",
  subject: "Operating Systems",
  examFrequency: 0,
  examsAvailable: 1,
  ...overrides,
});

describe("computeWeightedAllocation()", () => {
  it("splits time equally across topics when no weak subjects or exam-frequency signal apply", () => {
    const topics = [topic({ topic: "A" }), topic({ topic: "B" })];
    const { allocations, totalMinutesAvailable } = computeWeightedAllocation(topics, {
      hoursPerDay: 2,
      daysUntilTest: 1,
    });

    expect(totalMinutesAvailable).toBe(120);
    expect(allocations[0].minutes).toBeCloseTo(60, 5);
    expect(allocations[1].minutes).toBeCloseTo(60, 5);
  });

  it("gives weak-subject topics strictly more minutes than non-weak topics of the same base size", () => {
    const topics = [
      topic({ topic: "Weak", subject: "Data Structures and Algorithms" }),
      topic({ topic: "NotWeak", subject: "Operating Systems" }),
    ];
    const { allocations } = computeWeightedAllocation(topics, {
      hoursPerDay: 2,
      daysUntilTest: 1,
      weakSubjects: ["Data Structures and Algorithms"],
    });

    const weak = allocations.find((a) => a.topic === "Weak");
    const notWeak = allocations.find((a) => a.topic === "NotWeak");
    expect(weak.minutes).toBeGreaterThan(notWeak.minutes);
  });

  it("total allocated minutes always equals hoursPerDay * 60 * daysUntilTest exactly after renormalization", () => {
    const topics = [
      topic({ topic: "A", subject: "Operating Systems" }),
      topic({ topic: "B", subject: "Data Structures and Algorithms", examFrequency: 2, examsAvailable: 2 }),
      topic({ topic: "C", subject: "Operating Systems" }),
    ];
    const { allocations, totalMinutesAvailable } = computeWeightedAllocation(topics, {
      hoursPerDay: 3,
      daysUntilTest: 2,
      weakSubjects: ["Data Structures and Algorithms"],
    });

    const sum = allocations.reduce((s, a) => s + a.minutes, 0);
    expect(sum).toBeCloseTo(totalMinutesAvailable, 5);
  });

  it("exam-frequency nudge: topic tested in every available exam gets strictly more minutes than an identical-subject topic never examined", () => {
    const topics = [
      topic({ topic: "AlwaysTested", examFrequency: 1, examsAvailable: 1 }),
      topic({ topic: "NeverTested", examFrequency: 0, examsAvailable: 1 }),
    ];
    const { allocations } = computeWeightedAllocation(topics, { hoursPerDay: 2, daysUntilTest: 1 });

    const always = allocations.find((a) => a.topic === "AlwaysTested");
    const never = allocations.find((a) => a.topic === "NeverTested");
    expect(always.minutes).toBeGreaterThan(never.minutes);
  });

  it("compares exam-frequency ratio, not raw count, across a 1-exam course and a 2-exam course", () => {
    // CSE-301 topic tested in its 1 available exam -> ratio 1.0 -> gets the nudge.
    // CSE-201 topic tested in only 1 of its 2 available exams -> ratio 0.5 -> no nudge.
    // A raw-count comparison would wrongly treat both as "examFrequency: 1" and tie them.
    const topics = [
      topic({ topic: "OSFullRatio", examFrequency: 1, examsAvailable: 1 }),
      topic({ topic: "DSAHalfRatio", examFrequency: 1, examsAvailable: 2 }),
    ];
    const { allocations } = computeWeightedAllocation(topics, { hoursPerDay: 2, daysUntilTest: 1 });

    const os = allocations.find((a) => a.topic === "OSFullRatio");
    const dsa = allocations.find((a) => a.topic === "DSAHalfRatio");
    expect(os.minutes).toBeGreaterThan(dsa.minutes);
  });

  it("absurd-input edge case: many topics + very little time merges small allocations and returns a warning, without dropping minutes", () => {
    const topics = Array.from({ length: 30 }, (_, i) => topic({ topic: `Topic${i}` }));
    const { allocations, totalMinutesAvailable, warning } = computeWeightedAllocation(topics, {
      hoursPerDay: 1,
      daysUntilTest: 1,
    });

    expect(warning).toBeTruthy();
    allocations.forEach((a) => expect(a.minutes).toBeGreaterThanOrEqual(10 - 1e-6));
    const sum = allocations.reduce((s, a) => s + a.minutes, 0);
    expect(sum).toBeCloseTo(totalMinutesAvailable, 5);
  });

  it("returns no warning and empty allocations for zero topics", () => {
    const { allocations, warning } = computeWeightedAllocation([], { hoursPerDay: 2, daysUntilTest: 1 });
    expect(allocations).toEqual([]);
    expect(warning).toBeNull();
  });
});

describe("buildDeterministicPlan()", () => {
  it("produces validatePlanShape()-passing output with no LLM involved, for a range of input sizes", () => {
    const allocations = [
      { topic: "A", minutes: 90 },
      { topic: "B", minutes: 45 },
      { topic: "C", minutes: 200 },
    ];
    const result = buildDeterministicPlan(allocations, { testDate: "2099-01-01", hoursPerDay: 2 });

    expect(validatePlanShape(result)).toEqual({ valid: true });
  });

  it("wraps to the next day when a day's hoursPerDay budget is exhausted", () => {
    const allocations = [{ topic: "LongTopic", minutes: 180 }]; // 3 hours, budget is 1hr/day
    const result = buildDeterministicPlan(allocations, { testDate: "2099-01-01", hoursPerDay: 1 });

    expect(result.plan.length).toBeGreaterThan(1);
  });

  it("never produces a block with zero or negative duration", () => {
    const allocations = [
      { topic: "A", minutes: 30 },
      { topic: "B", minutes: 0.001 },
    ];
    const result = buildDeterministicPlan(allocations, { testDate: "2099-01-01", hoursPerDay: 2 });

    result.plan.forEach((day) => day.blocks.forEach((b) => expect(b.durationMinutes).toBeGreaterThan(0)));
  });

  it("preserves total allocated minutes across all blocks", () => {
    const allocations = [
      { topic: "A", minutes: 90 },
      { topic: "B", minutes: 150 },
    ];
    const result = buildDeterministicPlan(allocations, { testDate: "2099-01-01", hoursPerDay: 2 });

    const totalBlockMinutes = result.plan.reduce(
      (sum, day) => sum + day.blocks.reduce((s, b) => s + b.durationMinutes, 0),
      0
    );
    expect(totalBlockMinutes).toBeCloseTo(240, 0);
  });
});
