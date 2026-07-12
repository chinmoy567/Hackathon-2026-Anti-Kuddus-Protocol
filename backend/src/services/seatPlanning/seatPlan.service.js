import { SeatPlan } from "../../models/domain/seatPlan.model.js";
import { SeatStudent } from "../../models/domain/seatStudent.model.js";
import { ValidationError, NotFoundError } from "../../utils/errors.js";
import { heightSortAlgorithm } from "./heightSort.algorithm.js";

// Dispatch table — Task 3 adds "line_of_sight_optimized" here without touching this branch.
const ALGORITHMS = {
  height_sort: heightSortAlgorithm,
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
  const assignments = runAlgorithm(students, gridRows, gridCols);

  const plan = await SeatPlan.create({
    batchId,
    gridRows,
    gridCols,
    teacherPosition,
    aisleColumns,
    algorithm,
    feasible: true,
    infeasibilityReason: null,
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
