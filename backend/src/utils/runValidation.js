import { validationResult } from "express-validator";
import { ValidationError } from "./errors.js";

// Shared terminator for every express-validator chain array — collects field
// errors into claude.md's `errors[]` shape instead of express-validator's own.
export const runValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const fieldErrors = result.array().map((e) => ({
    field: e.path,
    code: "VALIDATION_ERROR",
    message: e.msg,
  }));
  next(new ValidationError(fieldErrors));
};
