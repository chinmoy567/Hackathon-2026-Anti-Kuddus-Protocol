import { body, param } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Shape/type checks only — teacherPosition-within-grid-bounds cross-check
// lives in seatPlan.service.js (API.md §8).
export const createSeatPlanValidation = [
  body("batchId").isString().trim().isLength({ min: 1 }).withMessage("batchId is required."),
  body("gridRows").isInt({ gt: 0 }).withMessage("gridRows must be a positive integer."),
  body("gridCols").isInt({ gt: 0 }).withMessage("gridCols must be a positive integer."),
  body("teacherPosition.row").isInt({ min: 0 }).withMessage("teacherPosition.row must be a non-negative integer."),
  body("teacherPosition.col").isInt({ min: 0 }).withMessage("teacherPosition.col must be a non-negative integer."),
  body("aisleColumns").optional().isArray().withMessage("aisleColumns must be an array."),
  body("aisleColumns.*").optional().isInt({ min: 0 }).withMessage("aisleColumns[] must be non-negative integers."),
  body("algorithm").isIn(["height_sort"]).withMessage('algorithm must be "height_sort".'),
  runValidation,
];

export const getSeatPlanValidation = [
  param("id").isMongoId().withMessage("id must be a valid seat plan id."),
  runValidation,
];
