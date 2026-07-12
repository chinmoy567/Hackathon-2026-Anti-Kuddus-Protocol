import mongoose from "mongoose";
import { anonymousConn } from "../../config/db.js";

// Mission 1 core record. Never carries rollNumber, studentId, ip, userAgent,
// or a precise timestamp (database.md §5.2 "never present" list).
const complaintSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["tiffin_theft", "bribes", "syllabus_bloat", "other"],
    index: true,
  },
  description: { type: String, required: true, maxlength: 2000 },
  evidenceFileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "EvidenceFile", default: [] }],
  status: {
    type: String,
    enum: ["pending", "validated", "rejected"],
    default: "pending",
    index: true,
  },
  countedAsStrike: { type: Boolean, default: false },
  validatedByRole: { type: String, default: null },
  validatedAtBucket: { type: Date, default: null },
  submittedAtBucket: { type: Date, required: true, index: true },
  tokenHash: { type: String, required: true },
});

export const Complaint = anonymousConn.model("Complaint", complaintSchema);
