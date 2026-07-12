import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env.js";
import { error } from "../utils/apiResponse.js";

// Roll-number keyspace is tiny (~30-60 values) — brute force must be throttled
// per rollNumber, not per IP (Requirements Report.md §2 M1).
export const loginLimiter = rateLimit({
  windowMs: env.loginRateLimit.windowMs,
  limit: env.loginRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body?.rollNumber || ipKeyGenerator(req.ip),
  handler: (req, res) =>
    error(res, {
      statusCode: 429,
      message: "Too many login attempts. Please try again later.",
      errors: [{ code: "RATE_LIMITED", message: "Login rate limit exceeded." }],
    }),
});
