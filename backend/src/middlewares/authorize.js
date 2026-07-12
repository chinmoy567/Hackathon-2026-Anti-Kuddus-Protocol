import { ForbiddenError } from "../utils/errors.js";

// Role gate — the concrete server-side enforcement point for every role rule
// in claude.md and API.md (e.g. captain_1st excluded from GET /complaints).
export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ForbiddenError());
  }
  next();
};
