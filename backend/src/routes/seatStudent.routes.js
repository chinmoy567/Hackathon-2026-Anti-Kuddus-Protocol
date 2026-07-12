import { Router } from "express";
import * as seatStudentController from "../controllers/seatStudent.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { createBatchValidation, getBatchValidation } from "../validations/seatStudent.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/batch",
  authenticate,
  authorize("teacher"),
  createBatchValidation,
  asyncHandler(seatStudentController.createBatch)
);

router.get(
  "/:batchId",
  authenticate,
  getBatchValidation,
  asyncHandler(seatStudentController.getBatch)
);

export default router;
