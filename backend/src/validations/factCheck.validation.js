import { query, body } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

export const searchValidation = [
  // .isString() must run before .trim() — express-validator's .trim()/.isLength() coerce
  // non-string values (numbers stringify, objects become "[object Object]", arrays crash
  // .trim() into an uncaught 500) instead of rejecting them (verify skill finding).
  query("q")
    .isString()
    .withMessage("q must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("q is required.")
    .isLength({ min: 1, max: 300 })
    .withMessage("q must be 1-300 characters."),
  runValidation,
];

export const verifyValidation = [
  body("claim")
    .isString()
    .withMessage("claim must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("claim is required.")
    .isLength({ min: 1, max: 500 })
    .withMessage("claim must be 1-500 characters."),
  runValidation,
];
