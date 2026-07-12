import { AnonymousToken } from "../models/anonymous/anonymousToken.model.js";
import { hashToken } from "../utils/tokenHash.js";
import { AppError, ConflictError } from "../utils/errors.js";

// Verifies X-Anonymous-Token for a given purpose. Does NOT mark the token used —
// consumption happens only inside complaint.service.create (API.md §6).
export const anonymousAuth = (expectedPurpose) => async (req, res, next) => {
  const rawToken = req.headers["x-anonymous-token"];
  if (!rawToken) {
    return next(new AppError("Missing anonymous token.", 401, "TOKEN_INVALID"));
  }

  const tokenHash = hashToken(rawToken);
  const doc = await AnonymousToken.findOne({ tokenHash });

  if (!doc || doc.purpose !== expectedPurpose || doc.expiresAt < new Date()) {
    return next(new AppError("Anonymous token is invalid or expired.", 401, "TOKEN_INVALID"));
  }
  if (doc.used) {
    return next(new ConflictError("This anonymous token has already been used.", "TOKEN_ALREADY_USED"));
  }

  req.anonymousToken = { doc, rawToken, tokenHash };
  next();
};
