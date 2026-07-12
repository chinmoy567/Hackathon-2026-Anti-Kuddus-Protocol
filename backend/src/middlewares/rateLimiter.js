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

// Generous per-student limit (API.md §11) — high enough to never block a
// genuine emergency retry storm, low enough to blunt flooding abuse.
export const sosLimiter = rateLimit({
  windowMs: env.sosRateLimit.windowMs,
  limit: env.sosRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: (req, res) =>
    error(res, {
      statusCode: 429,
      message: "Too many SOS requests. Please try again shortly.",
      errors: [{ code: "RATE_LIMITED", message: "SOS rate limit exceeded." }],
    }),
});

// Per-user half of the "per-user + global AI cost cap" (API.md §12). The global half is an
// accepted in-memory-per-process scope decision for this hackathon deployment — see
// task1-implementation-plan.md §2/§7.
export const syllabusLimiter = rateLimit({
  windowMs: env.syllabusRateLimit.windowMs,
  limit: env.syllabusRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  handler: (req, res) =>
    error(res, {
      statusCode: 429,
      message: "Too many AI requests. Please try again later.",
      errors: [{ code: "RATE_LIMITED", message: "Syllabus AI rate limit exceeded." }],
    }),
});
