import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/strike-state", authenticate, asyncHandler(dashboardController.getStrikeState));

export default router;
