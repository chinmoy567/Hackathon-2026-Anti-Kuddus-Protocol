import { body } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

export const issueTokenValidation = [
  body("purpose")
    .isIn(["complaint", "ledger_entry"])
    .withMessage("purpose must be 'complaint' or 'ledger_entry'."),
  runValidation,
];
