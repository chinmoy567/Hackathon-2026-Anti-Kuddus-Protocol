// Pure function: ascending-height seating, deterministic tie-break on rollNumber.
export const heightSortAlgorithm = (students, gridRows, gridCols) => {
  if (!Number.isInteger(gridRows) || gridRows <= 0 || !Number.isInteger(gridCols) || gridCols <= 0) {
    throw new Error("gridRows and gridCols must be positive integers.");
  }

  const sorted = [...students].sort((a, b) => {
    if (a.heightCm !== b.heightCm) return a.heightCm - b.heightCm;
    return a.rollNumber.localeCompare(b.rollNumber);
  });

  const assignments = [];
  let studentIndex = 0;

  for (let row = 0; row < gridRows; row += 1) {
    for (let col = 0; col < gridCols; col += 1) {
      const student = sorted[studentIndex] ?? null;
      assignments.push({
        seatRow: row,
        seatCol: col,
        studentId: student ? student._id : null,
        occluded: false,
        occlusionReason: null,
      });
      if (student) studentIndex += 1;
    }
  }

  return assignments;
};
