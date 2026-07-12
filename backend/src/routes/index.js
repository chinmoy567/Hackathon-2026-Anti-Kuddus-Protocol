import { Router } from "express";
import authRoutes from "./auth.routes.js";
import anonymousTokenRoutes from "./anonymousToken.routes.js";
import complaintRoutes from "./complaint.routes.js";
import evidenceRoutes from "./evidence.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import sosRoutes from "./sos.routes.js";
import seatStudentRoutes from "./seatStudent.routes.js";
import seatPlanRoutes from "./seatPlan.routes.js";
import ledgerEntryRoutes from "./ledgerEntry.routes.js";
import ledgerAnalyticsRoutes from "./ledgerAnalytics.routes.js";
import foodCatalogRoutes from "./foodCatalog.routes.js";
import syllabusRoutes from "./syllabus.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/anonymous-tokens", anonymousTokenRoutes);
router.use("/complaints", complaintRoutes);
router.use("/evidence", evidenceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/sos", sosRoutes);
router.use("/seat-students", seatStudentRoutes);
router.use("/seat-plans", seatPlanRoutes);
router.use("/ledger", ledgerEntryRoutes);
router.use("/ledger", ledgerAnalyticsRoutes);
router.use("/food-catalog", foodCatalogRoutes);
router.use("/syllabus", syllabusRoutes);

export default router;
