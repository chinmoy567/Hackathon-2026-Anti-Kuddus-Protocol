import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 2. Independent of identity.students by design — M2 is spec'd as
// usable standalone (database.md §6.2).
const seatStudentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
    heightCm: { type: Number, required: true, min: 1 },
    hasAccessibilityPriority: { type: Boolean, default: false },
    isKuddus: { type: Boolean, default: false },
    batchId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

seatStudentSchema.index({ isKuddus: 1 });
// Backstop against races on top of the service-layer duplicate check.
seatStudentSchema.index({ batchId: 1, rollNumber: 1 }, { unique: true });

export const SeatStudent = domainConn.model("SeatStudent", seatStudentSchema);
