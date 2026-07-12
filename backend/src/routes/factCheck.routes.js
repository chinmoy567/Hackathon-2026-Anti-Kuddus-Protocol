import { Router } from "express";
import * as factCheckController from "../controllers/factCheck.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { syllabusLimiter } from "../middlewares/rateLimiter.js";
import { searchValidation, verifyValidation } from "../validations/factCheck.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/search",
  authenticate,
  searchValidation,
  asyncHandler(factCheckController.search)
);

// Shares the syllabus AI rate-limit bucket per API.md §14 ("POST /syllabus/*, POST
// /fact-check/verify | per-user + global cap").
router.post(
  "/verify",
  authenticate,
  syllabusLimiter,
  verifyValidation,
  asyncHandler(factCheckController.verify)
);

export default router;
