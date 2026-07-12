import { describe, it, expect } from "vitest";
import { lineOfSightAlgorithm } from "../../src/services/seatPlanning/lineOfSight.algorithm.js";

const student = (rollNumber, heightCm, overrides = {}) => ({
  _id: rollNumber,
  rollNumber,
  heightCm,
  hasAccessibilityPriority: false,
  isKuddus: false,
  ...overrides,
});

describe("lineOfSightAlgorithm", () => {
  it("seats an accessibility-priority student in the front row even when tallest", () => {
    const students = [
      student("001", 200, { hasAccessibilityPriority: true }),
      student("002", 150),
      student("003", 160, { isKuddus: true }),
    ];

    const { assignments } = lineOfSightAlgorithm(students, 3, 1, { row: 0, col: 0 }, []);
    const frontRowAssignment = assignments.find((a) => a.seatRow === 0);
    expect(frontRowAssignment.studentId).toBe("001");
  });

  it("is infeasible when the accessibility student's forced front seat occludes Kuddus, but still returns full assignments", () => {
    // Teacher stands behind row 0 (row -1 is not representable, so use row 0 as an
    // occupied accessibility row and put Kuddus two rows back with the teacher one
    // row further still) -> single column, 4 rows, teacher at row 0's *seat row*
    // is not itself the accessibility seat: force the accessibility student into
    // row 1 (between teacher row 0 and Kuddus row 2) by seating two accessibility
    // students so the first fills row 0 and the second — the one that matters —
    // fills row 1, directly on Kuddus's ray.
    const students = [
      student("001", 140, { hasAccessibilityPriority: true }),
      student("004", 145, { hasAccessibilityPriority: true }),
      student("002", 160, { isKuddus: true }),
    ];

    const { assignments, feasible, infeasibilityReason } = lineOfSightAlgorithm(
      students,
      3,
      1,
      { row: 0, col: 0 },
      []
    );

    expect(feasible).toBe(false);
    expect(infeasibilityReason).toBeTruthy();
    expect(assignments).toHaveLength(3);
    expect(assignments.every((a) => a.seatRow !== undefined)).toBe(true);
  });

  it("produces deterministic output across repeated runs on identical input", () => {
    const students = [
      student("003", 170),
      student("001", 150, { hasAccessibilityPriority: true }),
      student("002", 160, { isKuddus: true }),
    ];

    const first = lineOfSightAlgorithm(students, 3, 2, { row: 0, col: 0 }, []);
    const second = lineOfSightAlgorithm(students, 3, 2, { row: 0, col: 0 }, []);

    expect(first.assignments).toEqual(second.assignments);
    expect(first.feasible).toBe(second.feasible);
  });

  it("never assigns a student to an aisle column", () => {
    const students = [student("001", 150), student("002", 160, { isKuddus: true }), student("003", 170)];

    const { assignments } = lineOfSightAlgorithm(students, 2, 3, { row: 0, col: 0 }, [1]);
    const aisleAssignments = assignments.filter((a) => a.seatCol === 1);
    expect(aisleAssignments.every((a) => a.studentId === null)).toBe(true);
  });

  it("throws on malformed grid dimensions", () => {
    expect(() => lineOfSightAlgorithm([], 0, 3, { row: 0, col: 0 }, [])).toThrow();
  });
});
