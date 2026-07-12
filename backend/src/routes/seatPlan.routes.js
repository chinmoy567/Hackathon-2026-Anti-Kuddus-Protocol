import { Router } from "express";
import * as seatPlanController from "../controllers/seatPlan.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { createSeatPlanValidation, getSeatPlanValidation } from "../validations/seatPlan.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("teacher"),
  createSeatPlanValidation,
  asyncHandler(seatPlanController.createPlan)
);

router.get(
  "/:id",
  authenticate,
  getSeatPlanValidation,
  asyncHandler(seatPlanController.getPlan)
);

export default router;
