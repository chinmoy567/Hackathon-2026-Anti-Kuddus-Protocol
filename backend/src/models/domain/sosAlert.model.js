import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 5. Senders are identified — the deliberate exception to the
// anonymity design (database.md §6.4, Architecture Decision D8).
const sosAlertSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  location: {
    type: String,
    required: true,
    enum: ["Library", "Playground", "Corridor", "Classroom", "Canteen"],
  },
  status: { type: String, enum: ["active", "acknowledged", "resolved"], default: "active", index: true },
  occurredAt: { type: Date, required: true, index: true },
  syncedAt: { type: Date, required: true },
  clientEventId: { type: String, required: true },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  acknowledgedAt: { type: Date, default: null },
  resolvedAt: { type: Date, default: null },
});

// Idempotency/dedup guarantee for offline-queue replay (database.md §6.4).
sosAlertSchema.index({ studentId: 1, clientEventId: 1 }, { unique: true });

export const SosAlert = domainConn.model("SosAlert", sosAlertSchema);
