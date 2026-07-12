import { Router } from "express";
import * as complaintController from "../controllers/complaint.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { anonymousAuth } from "../middlewares/anonymousAuth.js";
import {
  createComplaintValidation,
  listComplaintsValidation,
  updateComplaintStatusValidation,
} from "../validations/complaint.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  anonymousAuth("complaint"),
  createComplaintValidation,
  asyncHandler(complaintController.create)
);

// captain_1st intentionally excluded — the single most important server-side
// check in the API (API.md §5, API-7).
router.get(
  "/",
  authenticate,
  authorize("teacher", "captain_2nd", "captain_3rd"),
  listComplaintsValidation,
  asyncHandler(complaintController.list)
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("teacher"),
  updateComplaintStatusValidation,
  asyncHandler(complaintController.updateStatus)
);

export default router;
