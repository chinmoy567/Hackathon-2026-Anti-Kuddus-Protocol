import { Router } from "express";
import authRoutes from "./auth.routes.js";
import anonymousTokenRoutes from "./anonymousToken.routes.js";
import complaintRoutes from "./complaint.routes.js";
import evidenceRoutes from "./evidence.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import sosRoutes from "./sos.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/anonymous-tokens", anonymousTokenRoutes);
router.use("/complaints", complaintRoutes);
router.use("/evidence", evidenceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/sos", sosRoutes);

export default router;
