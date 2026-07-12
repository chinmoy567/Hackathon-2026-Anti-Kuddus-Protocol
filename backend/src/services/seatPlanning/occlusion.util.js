// Modeling Assumptions (task3-line-of-sight-optimization.md §1, decision confirmed against
// Hackathon Question.md/Requirements Report.md §M2 — simple presence-based occlusion, not a
// height/angle threshold):
// - Each grid row is one unit of depth, each grid column one unit of width; uniform 1-unit
//   spacing on both axes — no real-world cm mapping.
// - A seated student occludes the teacher's sight line to Kuddus's desk only if that student's
//   seatRow is strictly between the teacher's row and Kuddus's row, AND their seatCol lies on the
//   interpolated ray path (linear interpolation between the teacher's and Kuddus's columns,
//   rounded to the nearest column since desks are discrete grid cells).
// - Height only matters in the binary sense of "a student is seated there" — any such student
//   occludes, regardless of heightCm magnitude.
// - Aisle columns are never occupied and never occlude.
export const isOccluded = ({ teacherPosition, kuddusSeat, candidateSeat, aisleColumns = [] }) => {
  const { row: candRow, col: candCol } = candidateSeat;

  const minRow = Math.min(teacherPosition.row, kuddusSeat.row);
  const maxRow = Math.max(teacherPosition.row, kuddusSeat.row);
  if (candRow <= minRow || candRow >= maxRow) return false;

  if (aisleColumns.includes(candCol)) return false;

  const rowSpan = kuddusSeat.row - teacherPosition.row;
  const t = (candRow - teacherPosition.row) / rowSpan;
  const rayCol = Math.round(teacherPosition.col + t * (kuddusSeat.col - teacherPosition.col));

  return candCol === rayCol;
};

// Human-readable explanation for why Kuddus's desk is (or isn't) occluded, built from the
// blocking student found on the ray, if any.
export const buildOcclusionReason = (blockingStudent, blockingSeat) => {
  if (!blockingStudent) return null;
  return `Blocked by ${blockingStudent.name} (roll ${blockingStudent.rollNumber}) at row ${blockingSeat.row + 1}, seat ${blockingSeat.col + 1}.`;
};
