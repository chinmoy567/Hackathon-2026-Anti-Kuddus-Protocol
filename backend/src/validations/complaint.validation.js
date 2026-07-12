import { body, query, param } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Enum/length bounds mirror API.md §14 exactly — no drift between the two documents.
export const createComplaintValidation = [
  body("category")
    .isIn(["tiffin_theft", "bribes", "syllabus_bloat", "other"])
    .withMessage("category must be one of tiffin_theft, bribes, syllabus_bloat, other."),
  body("description")
    .isString()
    .isLength({ min: 1, max: 2000 })
    .withMessage("description must be 1-2000 characters."),
  body("evidenceFileIds").optional().isArray().withMessage("evidenceFileIds must be an array."),
  body("evidenceFileIds.*").optional().isMongoId().withMessage("evidenceFileIds must contain valid ids."),
  runValidation,
];

export const listComplaintsValidation = [
  query("status").optional().isIn(["pending", "validated", "rejected"]),
  query("category").optional().isIn(["tiffin_theft", "bribes", "syllabus_bloat", "other"]),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  runValidation,
];

export const updateComplaintStatusValidation = [
  param("id").isMongoId().withMessage("Invalid complaint id."),
  body("status")
    .isIn(["validated", "rejected"])
    .withMessage("status must be 'validated' or 'rejected'."),
  runValidation,
];
