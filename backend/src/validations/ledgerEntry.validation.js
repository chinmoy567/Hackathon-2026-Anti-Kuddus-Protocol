import { body } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

// Mirrors API.md §10 exactly. amount is never accepted from the client
// (API.md API-4) — only type/foodItemId/quantity are valid body fields.
export const createEntryValidation = [
  body("type").isIn(["cash", "food"]).withMessage("type must be 'cash' or 'food'."),
  body("foodItemId")
    .if(body("type").equals("food"))
    .isMongoId()
    .withMessage("foodItemId is required and must be valid when type is 'food'."),
  body("quantity")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("quantity must be between 1 and 20."),
  runValidation,
];
