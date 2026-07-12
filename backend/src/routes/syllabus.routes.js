import { Router } from "express";
import * as syllabusController from "../controllers/syllabus.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { syllabusLimiter } from "../middlewares/rateLimiter.js";
import {
  summarizeValidation,
  filterValidation,
  studyPlanValidation,
} from "../validations/syllabus.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/summarize",
  authenticate,
  syllabusLimiter,
  summarizeValidation,
  asyncHandler(syllabusController.summarize)
);

router.post(
  "/filter",
  authenticate,
  syllabusLimiter,
  filterValidation,
  asyncHandler(syllabusController.filter)
);

router.post(
  "/study-plan",
  authenticate,
  syllabusLimiter,
  studyPlanValidation,
  asyncHandler(syllabusController.studyPlan)
);

export default router;
