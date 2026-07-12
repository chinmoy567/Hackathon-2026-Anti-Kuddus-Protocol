import { SeatPlan } from "../../models/domain/seatPlan.model.js";
import { SeatStudent } from "../../models/domain/seatStudent.model.js";
import { ValidationError, NotFoundError } from "../../utils/errors.js";
import { heightSortAlgorithm } from "./heightSort.algorithm.js";
import { lineOfSightAlgorithm } from "./lineOfSight.algorithm.js";

// Dispatch table — each algorithm receives the same full argument set;
// heightSortAlgorithm ignores the extra teacherPosition/aisleColumns args.
const ALGORITHMS = {
  height_sort: heightSortAlgorithm,
  line_of_sight_optimized: lineOfSightAlgorithm,
};

// Generates and persists one seat plan for a batch (API.md §8).
export const generatePlan = async ({ batchId, gridRows, gridCols, teacherPosition, aisleColumns = [], algorithm }) => {
  if (teacherPosition.row >= gridRows || teacherPosition.col >= gridCols) {
    throw new ValidationError(
      [{ field: "teacherPosition", code: "TEACHER_POSITION_OUT_OF_BOUNDS", message: "teacherPosition must be within the grid." }],
      "teacherPosition is out of grid bounds."
    );
  }

  const students = await SeatStudent.find({ batchId });
  const runAlgorithm = ALGORITHMS[algorithm];
  const result = runAlgorithm(students, gridRows, gridCols, teacherPosition, aisleColumns);
  const { assignments, feasible, infeasibilityReason } = Array.isArray(result)
    ? { assignments: result, feasible: true, infeasibilityReason: null }
    : result;

  const plan = await SeatPlan.create({
    batchId,
    gridRows,
    gridCols,
    teacherPosition,
    aisleColumns,
    algorithm,
    feasible,
    infeasibilityReason,
    assignments,
    generatedAt: new Date(),
  });

  return plan;
};

export const getPlanById = async (id) => {
  const plan = await SeatPlan.findById(id);
  if (!plan) throw new NotFoundError("Seat plan not found.");
  return plan;
};
