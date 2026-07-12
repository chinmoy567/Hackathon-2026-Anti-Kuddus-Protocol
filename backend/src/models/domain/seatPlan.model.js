import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Persisted output of the Seat Planning Service (database.md §6.3).
const teacherPositionSchema = new mongoose.Schema(
  {
    row: { type: Number, required: true },
    col: { type: Number, required: true },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    seatRow: { type: Number, required: true },
    seatCol: { type: Number, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "SeatStudent", default: null },
    occluded: { type: Boolean, default: false },
    occlusionReason: { type: String, default: null },
  },
  { _id: false }
);

const seatPlanSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, index: true },
    gridRows: { type: Number, required: true },
    gridCols: { type: Number, required: true },
    teacherPosition: { type: teacherPositionSchema, required: true },
    aisleColumns: { type: [Number], default: [] },
    algorithm: { type: String, enum: ["height_sort", "line_of_sight_optimized"], required: true },
    feasible: { type: Boolean, default: true },
    infeasibilityReason: { type: String, default: null },
    assignments: { type: [assignmentSchema], default: [] },
    generatedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const SeatPlan = domainConn.model("SeatPlan", seatPlanSchema);
