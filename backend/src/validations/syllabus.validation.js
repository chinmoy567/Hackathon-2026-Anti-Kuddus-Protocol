import { body } from "express-validator";
import { runValidation } from "../utils/runValidation.js";
import { MAX_SYLLABUS_TEXT_LENGTH } from "../services/aiGateway.service.js";
import { env } from "../config/env.js";

export const summarizeValidation = [
  body("syllabusText")
    .trim()
    .notEmpty()
    .withMessage("syllabusText is required.")
    .isLength({ min: 1, max: MAX_SYLLABUS_TEXT_LENGTH })
    .withMessage(`syllabusText must be 1-${MAX_SYLLABUS_TEXT_LENGTH} characters.`),
  runValidation,
];

// Identical body shape to summarizeValidation today — kept as a separate export since the two
// endpoints' validation may reasonably diverge later (task2 plan §4).
export const filterValidation = [
  body("syllabusText")
    .trim()
    .notEmpty()
    .withMessage("syllabusText is required.")
    .isLength({ min: 1, max: MAX_SYLLABUS_TEXT_LENGTH })
    .withMessage(`syllabusText must be 1-${MAX_SYLLABUS_TEXT_LENGTH} characters.`),
  runValidation,
];

export const studyPlanValidation = [
  body("topics").isArray({ min: 1 }).withMessage("topics must be a non-empty array."),
  body("topics.*").isString().withMessage("Each topic must be a string."),
  // Future-date-ness is checked in the controller (not here) so the 400
  // TEST_DATE_MUST_BE_FUTURE error code survives — express-validator's .custom() errors are
  // collapsed into the generic VALIDATION_ERROR shape by runValidation.js, losing the
  // API.md §9-required distinct code.
  body("testDate").isISO8601().withMessage("testDate must be a valid ISO8601 date."),
  body("hoursPerDay")
    .optional()
    .isFloat({ min: env.studyPlan.minHoursPerDay, max: env.studyPlan.maxHoursPerDay })
    .withMessage(`hoursPerDay must be between ${env.studyPlan.minHoursPerDay} and ${env.studyPlan.maxHoursPerDay}.`),
  body("weakSubjects").optional().isArray().withMessage("weakSubjects must be an array."),
  body("weakSubjects.*").optional().isString().withMessage("Each weakSubject must be a string."),
  runValidation,
];
