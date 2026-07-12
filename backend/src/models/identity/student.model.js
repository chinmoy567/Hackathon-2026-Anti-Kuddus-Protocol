import mongoose from "mongoose";
import { identityConn } from "../../config/db.js";

// The class roster. Auth is roll-number + pre-provisioned PIN (database.md §4.1).
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true, index: true },
    pinHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["student", "captain_2nd", "captain_3rd", "captain_1st", "teacher"],
      default: "student",
      index: true,
    },
    isActive: { type: Boolean, default: true },
    tokenIssuance: {
      count: { type: Number, default: 0 },
      windowStart: { type: Date, default: Date.now },
    },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Student = identityConn.model("Student", studentSchema);
