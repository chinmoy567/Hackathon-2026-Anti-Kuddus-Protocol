import { SeatStudent } from "../models/domain/seatStudent.model.js";
import { ValidationError } from "../utils/errors.js";

// Idempotent replace of one roster batch — re-submitting a batchId replaces
// it rather than appending (API.md §8).
export const upsertBatch = async (batchId, students) => {
  const kuddusCount = students.filter((s) => s.isKuddus).length;
  if (kuddusCount !== 1) {
    throw new ValidationError(
      [{ field: "students", code: "EXACTLY_ONE_KUDDUS_REQUIRED", message: "Exactly one student must have isKuddus=true." }],
      "Exactly one student must be flagged as Kuddus."
    );
  }

  const rollNumbers = students.map((s) => s.rollNumber);
  if (new Set(rollNumbers).size !== rollNumbers.length) {
    throw new ValidationError(
      [{ field: "students", code: "DUPLICATE_ROLL_NUMBER_IN_BATCH", message: "rollNumber must be unique within the batch." }],
      "Duplicate rollNumber within the batch."
    );
  }

  await SeatStudent.deleteMany({ batchId });
  await SeatStudent.insertMany(students.map((s) => ({ ...s, batchId })));

  return { batchId, count: students.length };
};

export const getBatch = async (batchId) => {
  const students = await SeatStudent.find({ batchId });
  return { students };
};
