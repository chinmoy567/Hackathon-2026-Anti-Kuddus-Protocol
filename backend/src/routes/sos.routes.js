import { Router } from "express";
import * as sosController from "../controllers/sos.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { sosLimiter } from "../middlewares/rateLimiter.js";
import { createSosValidation, sosIdValidation } from "../validations/sos.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("student"),
  sosLimiter,
  createSosValidation,
  asyncHandler(sosController.create)
);

router.get(
  "/active",
  authenticate,
  authorize("captain_2nd", "captain_3rd", "teacher"),
  asyncHandler(sosController.listActive)
);

router.patch(
  "/:id/acknowledge",
  authenticate,
  authorize("captain_2nd", "captain_3rd"),
  sosIdValidation,
  asyncHandler(sosController.acknowledge)
);

router.patch(
  "/:id/resolve",
  authenticate,
  authorize("captain_2nd", "captain_3rd"),
  sosIdValidation,
  asyncHandler(sosController.resolve)
);

export default router;
