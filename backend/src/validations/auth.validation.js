import { body } from "express-validator";
import { runValidation } from "../utils/runValidation.js";

export const loginValidation = [
  body("rollNumber").trim().notEmpty().withMessage("Roll number is required."),
  body("pin").notEmpty().withMessage("PIN is required."),
  runValidation,
];
