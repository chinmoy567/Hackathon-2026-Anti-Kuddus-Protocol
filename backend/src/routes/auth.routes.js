import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import { loginValidation } from "../validations/auth.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/login", loginLimiter, loginValidation, asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authenticate, asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;
