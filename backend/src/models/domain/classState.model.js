import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

const SINGLETON_ID = "singleton";

// The materialized strike counter driving "Warnings: X/3" (database.md §6.1).
// Exactly one document ever exists; enforced here, not left to callers.
const classStateSchema = new mongoose.Schema(
  {
    _id: { type: String, default: SINGLETON_ID },
    strikeCount: { type: Number, default: 0, min: 0, max: 3 },
    impeached: { type: Boolean, default: false },
    impeachedAtBucket: { type: Date, default: null },
    lastStrikeAtBucket: { type: Date, default: null },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

classStateSchema.statics.getOrCreate = async function () {
  const existing = await this.findById(SINGLETON_ID);
  if (existing) return existing;
  return this.create({ _id: SINGLETON_ID });
};

export const ClassState = domainConn.model("ClassState", classStateSchema);
