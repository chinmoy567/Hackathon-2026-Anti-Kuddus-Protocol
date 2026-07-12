import { Router } from "express";
import * as evidenceController from "../controllers/evidence.controller.js";
import { anonymousAuth } from "../middlewares/anonymousAuth.js";
import { uploadMiddleware, handleMulterError } from "../services/evidenceProcessing.service.js";
import { ensureFilePresent } from "../validations/evidence.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  anonymousAuth("complaint"),
  uploadMiddleware,
  handleMulterError,
  ensureFilePresent,
  asyncHandler(evidenceController.upload)
);

export default router;
