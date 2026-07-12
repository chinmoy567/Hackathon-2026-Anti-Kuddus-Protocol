import mongoose from "mongoose";
import { anonymousConn } from "../../config/db.js";

// Never present: original filename, EXIF/metadata blob, uploader reference,
// precise timestamp (database.md §5.3).
const evidenceFileSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", default: null, index: true },
  cloudinaryPublicId: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  mimeType: { type: String, required: true, enum: ["image/jpeg", "image/png", "image/webp"] },
  sizeBytes: { type: Number, required: true },
  sanitized: { type: Boolean, required: true, default: false },
  sanitizedAtBucket: { type: Date, default: null },
});

export const EvidenceFile = anonymousConn.model("EvidenceFile", evidenceFileSchema);
