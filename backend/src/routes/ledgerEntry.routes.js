import { Router } from "express";
import * as ledgerEntryController from "../controllers/ledgerEntry.controller.js";
import { anonymousAuth } from "../middlewares/anonymousAuth.js";
import { createEntryValidation } from "../validations/ledgerEntry.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/entries",
  anonymousAuth("ledger_entry"),
  createEntryValidation,
  asyncHandler(ledgerEntryController.createEntry)
);

export default router;
