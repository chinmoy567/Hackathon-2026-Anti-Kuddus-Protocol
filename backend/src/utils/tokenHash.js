import crypto from "crypto";

// SHA-256 hashing for anonymous submission tokens and refresh tokens — only the
// hash is ever persisted; the raw value is returned to the caller exactly once.
export const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

export const generateRawToken = () => crypto.randomBytes(32).toString("hex");
