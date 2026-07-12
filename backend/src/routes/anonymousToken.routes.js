import { Router } from "express";
import * as anonymousTokenController from "../controllers/anonymousToken.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { issueTokenValidation } from "../validations/anonymousToken.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// role: student only — mechanically enforces "captains cannot complain about
// captains" (API.md §4, API-1).
router.post(
  "/",
  authenticate,
  authorize("student"),
  issueTokenValidation,
  asyncHandler(anonymousTokenController.issue)
);

export default router;
