import { isOccluded, buildOcclusionReason } from "./occlusion.util.js";

const sortByHeightThenRoll = (students) =>
  [...students].sort((a, b) => {
    if (a.heightCm !== b.heightCm) return a.heightCm - b.heightCm;
    return a.rollNumber.localeCompare(b.rollNumber);
  });

// Row-major seatable slots (front row first), skipping aisle columns.
const buildSeatableSlots = (gridRows, gridCols, aisleColumns) => {
  const slots = [];
  for (let row = 0; row < gridRows; row += 1) {
    for (let col = 0; col < gridCols; col += 1) {
      if (!aisleColumns.includes(col)) slots.push({ row, col });
    }
  }
  return slots;
};

// Pure function: accessibility-priority students seated front-first (hard constraint), then
// remaining students by ascending height, minimizing occlusion of Kuddus's desk from the
// teacher's position. Never throws for an unsatisfiable objective — only for malformed grid
// dimensions (task3-line-of-sight-optimization.md §6).
export const lineOfSightAlgorithm = (students, gridRows, gridCols, teacherPosition, aisleColumns = []) => {
  if (!Number.isInteger(gridRows) || gridRows <= 0 || !Number.isInteger(gridCols) || gridCols <= 0) {
    throw new Error("gridRows and gridCols must be positive integers.");
  }

  const accessibilityStudents = sortByHeightThenRoll(students.filter((s) => s.hasAccessibilityPriority));
  const remainingStudents = sortByHeightThenRoll(students.filter((s) => !s.hasAccessibilityPriority));

  const slots = buildSeatableSlots(gridRows, gridCols, aisleColumns);
  const seatByStudentId = new Map();
  let slotIndex = 0;

  for (const student of accessibilityStudents) {
    if (slotIndex >= slots.length) break;
    seatByStudentId.set(String(student._id), slots[slotIndex]);
    slotIndex += 1;
  }
  for (const student of remainingStudents) {
    if (slotIndex >= slots.length) break;
    seatByStudentId.set(String(student._id), slots[slotIndex]);
    slotIndex += 1;
  }

  const studentById = new Map(students.map((s) => [String(s._id), s]));
  const accessibilityIds = new Set(accessibilityStudents.map((s) => String(s._id)));

  const kuddus = students.find((s) => s.isKuddus);
  const kuddusSeat = kuddus ? seatByStudentId.get(String(kuddus._id)) : null;

  let feasible = true;
  let infeasibilityReason = null;
  let blockingStudent = null;
  let blockingSeat = null;

  const assignments = [];
  for (let row = 0; row < gridRows; row += 1) {
    for (let col = 0; col < gridCols; col += 1) {
      const isAisle = aisleColumns.includes(col);
      let occupantId = null;
      for (const [studentId, seat] of seatByStudentId) {
        if (seat.row === row && seat.col === col) {
          occupantId = studentId;
          break;
        }
      }

      let occluded = false;
      if (!isAisle && kuddusSeat && occupantId && occupantId !== String(kuddus._id)) {
        occluded = isOccluded({
          teacherPosition,
          kuddusSeat,
          candidateSeat: { row, col },
          aisleColumns,
        });
        if (occluded && !blockingStudent) {
          blockingStudent = studentById.get(occupantId);
          blockingSeat = { row, col };
          if (accessibilityIds.has(occupantId)) {
            feasible = false;
          }
        }
      }

      assignments.push({
        seatRow: row,
        seatCol: col,
        studentId: isAisle ? null : occupantId,
        occluded,
        occlusionReason: occluded ? buildOcclusionReason(blockingStudent, blockingSeat) : null,
      });
    }
  }

  if (!feasible) {
    infeasibilityReason =
      "An accessibility-priority student's required front-row seat blocks the teacher's line of sight to Kuddus's desk, and no alternative arrangement satisfies both constraints.";
  }

  return { assignments, feasible, infeasibilityReason };
};
