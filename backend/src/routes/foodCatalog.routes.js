import { Router } from "express";
import * as ledgerEntryController from "../controllers/ledgerEntry.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// role: any authenticated user (API.md §10).
router.get("/", authenticate, asyncHandler(ledgerEntryController.listFoodCatalog));

export default router;
