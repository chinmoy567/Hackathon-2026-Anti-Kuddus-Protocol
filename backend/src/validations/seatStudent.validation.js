import { body, param } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Shape/type checks only — cross-record invariants (exactly-one-Kuddus, no
// duplicate rollNumber) live in seatStudent.service.js (API.md §8).
export const createBatchValidation = [
  body("batchId").isString().trim().isLength({ min: 1 }).withMessage("batchId is required."),
  body("students").isArray({ min: 1 }).withMessage("students must be a non-empty array."),
  body("students.*.rollNumber")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("students[].rollNumber is required."),
  body("students.*.name").isString().trim().isLength({ min: 1 }).withMessage("students[].name is required."),
  body("students.*.heightCm")
    .isFloat({ gt: 0 })
    .withMessage("students[].heightCm must be greater than 0."),
  body("students.*.hasAccessibilityPriority").optional().isBoolean(),
  body("students.*.isKuddus").optional().isBoolean(),
  runValidation,
];

export const getBatchValidation = [
  param("batchId").isString().trim().isLength({ min: 1 }).withMessage("batchId is required."),
  runValidation,
];
