// JSON Schema (not Zod — task3 plan §0: no zod installed, matches parseDuration.js's
// "avoid a dependency for something this small" precedent) passed to LangChain's
// ChatOpenAI.withStructuredOutput(). Doubles as the spec for validatePlanShape() below —
// one shape, two use sites, no drift.
export const STUDY_PLAN_JSON_SCHEMA = {
  name: "study_plan",
  schema: {
    type: "object",
    properties: {
      plan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type: "string" },
            blocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topic: { type: "string" },
                  startTime: { type: "string" },
                  endTime: { type: "string" },
                  durationMinutes: { type: "number" },
                },
                required: ["topic", "startTime", "endTime", "durationMinutes"],
              },
            },
          },
          required: ["date", "blocks"],
        },
      },
    },
    required: ["plan"],
  },
};

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Hand-rolled structural check mirroring STUDY_PLAN_JSON_SCHEMA — used both to decide whether
// the LLM's first attempt needs a retry (studyPlan.service.js#generatePlan), and as the final
// guard before the controller ever sees data.plan.
export const validatePlanShape = (candidate) => {
  const errors = [];

  if (!candidate || typeof candidate !== "object") {
    return { valid: false, errors: ["Response must be an object."] };
  }
  if (!Array.isArray(candidate.plan)) {
    return { valid: false, errors: ["Response must have a `plan` array."] };
  }

  candidate.plan.forEach((day, dayIndex) => {
    if (typeof day?.date !== "string" || day.date.length === 0) {
      errors.push(`plan[${dayIndex}].date must be a non-empty string.`);
    }
    if (!Array.isArray(day?.blocks)) {
      errors.push(`plan[${dayIndex}].blocks must be an array.`);
      return;
    }
    day.blocks.forEach((block, blockIndex) => {
      const prefix = `plan[${dayIndex}].blocks[${blockIndex}]`;
      if (typeof block?.topic !== "string" || block.topic.length === 0) {
        errors.push(`${prefix}.topic must be a non-empty string.`);
      }
      if (typeof block?.startTime !== "string" || !TIME_PATTERN.test(block.startTime)) {
        errors.push(`${prefix}.startTime must be an HH:mm string.`);
      }
      if (typeof block?.endTime !== "string" || !TIME_PATTERN.test(block.endTime)) {
        errors.push(`${prefix}.endTime must be an HH:mm string.`);
      }
      if (typeof block?.durationMinutes !== "number" || block.durationMinutes <= 0) {
        errors.push(`${prefix}.durationMinutes must be a positive number.`);
      }
    });
  });

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
};
