import { Router } from "express";
import * as ledgerAnalyticsController from "../controllers/ledgerAnalytics.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getSummaryValidation } from "../validations/ledgerAnalytics.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// role: any authenticated user (API.md §10).
router.get("/summary", authenticate, getSummaryValidation, asyncHandler(ledgerAnalyticsController.getSummary));

export default router;
