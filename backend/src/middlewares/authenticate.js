import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

// Verifies the session access JWT and attaches { id, role } to req.user.
// Used by every endpoint except the anonymous-token-gated writes.
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Authentication required.", 401, "UNAUTHENTICATED"));
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError("Session expired or invalid.", 401, "UNAUTHENTICATED"));
  }
};
