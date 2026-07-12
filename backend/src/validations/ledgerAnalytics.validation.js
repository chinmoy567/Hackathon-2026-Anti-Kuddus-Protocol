import { query } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Mirrors API.md §10 — groupBy is optional, defaults to "day" in the service.
export const getSummaryValidation = [
  query("groupBy").optional().isIn(["day", "week"]).withMessage("groupBy must be 'day' or 'week'."),
  runValidation,
];
