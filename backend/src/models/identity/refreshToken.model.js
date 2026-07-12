import mongoose from "mongoose";
import { identityConn } from "../../config/db.js";

// Supports refresh-token rotation and multi-device revocation (database.md §4.2).
const refreshTokenSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index — Mongo auto-deletes the document once expiresAt passes.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = identityConn.model("RefreshToken", refreshTokenSchema);
