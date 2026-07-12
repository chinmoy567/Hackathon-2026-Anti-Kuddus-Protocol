import mongoose from "mongoose";
import { anonymousConn } from "../../config/db.js";

// The Anonymity Service's one-way ticket. Carries no identity data at all
// (database.md §5.1, System Architecture.md D2).
const anonymousTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  purpose: { type: String, required: true, enum: ["complaint", "ledger_entry"] },
  issuedAtBucket: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  usedAtBucket: { type: Date, default: null },
});

anonymousTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AnonymousToken = anonymousConn.model("AnonymousToken", anonymousTokenSchema);
