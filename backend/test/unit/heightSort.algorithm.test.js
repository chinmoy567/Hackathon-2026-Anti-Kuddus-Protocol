import { describe, it, expect } from "vitest";
import { heightSortAlgorithm } from "../../src/services/seatPlanning/heightSort.algorithm.js";

const student = (rollNumber, heightCm, id) => ({ _id: id ?? rollNumber, rollNumber, heightCm });

describe("heightSortAlgorithm", () => {
  it("orders students ascending by heightCm, front row to back row", () => {
    const students = [student("003", 170), student("001", 150), student("002", 160)];
    const assignments = heightSortAlgorithm(students, 3, 1);

    const heights = assignments.map((a) => {
      const s = students.find((st) => st._id === a.studentId);
      return s.heightCm;
    });
    expect(heights).toEqual([150, 160, 170]);
  });

  it("ties on heightCm break deterministically by ascending rollNumber, twice in a row", () => {
    const students = [student("002", 150), student("001", 150), student("003", 150)];

    const first = heightSortAlgorithm(students, 3, 1);
    const second = heightSortAlgorithm(students, 3, 1);

    expect(first.map((a) => a.studentId)).toEqual(["001", "002", "003"]);
    expect(second.map((a) => a.studentId)).toEqual(first.map((a) => a.studentId));
  });

  it("leaves surplus seats empty (studentId: null) when students < gridRows*gridCols", () => {
    const students = [student("001", 150), student("002", 160)];
    const assignments = heightSortAlgorithm(students, 2, 2);

    expect(assignments).toHaveLength(4);
    const filled = assignments.filter((a) => a.studentId !== null);
    const empty = assignments.filter((a) => a.studentId === null);
    expect(filled).toHaveLength(2);
    expect(empty).toHaveLength(2);
    empty.forEach((a) => {
      expect(a.occluded).toBe(false);
      expect(a.occlusionReason).toBeNull();
    });
  });

  it("fills row-major, front row (row 0) before back row, left to right", () => {
    const students = Array.from({ length: 6 }, (_, i) => student(String(i + 1).padStart(3, "0"), 150 + i));
    const assignments = heightSortAlgorithm(students, 2, 3);

    const order = assignments.map((a) => `${a.seatRow},${a.seatCol}`);
    expect(order).toEqual(["0,0", "0,1", "0,2", "1,0", "1,1", "1,2"]);
    expect(assignments.slice(0, 3).map((a) => a.studentId)).toEqual(["001", "002", "003"]);
  });

  it("throws on malformed grid dimensions", () => {
    expect(() => heightSortAlgorithm([], 0, 3)).toThrow();
    expect(() => heightSortAlgorithm([], 3, -1)).toThrow();
  });

  it("does not throw for zero students (empty desks are valid, not an error)", () => {
    expect(() => heightSortAlgorithm([], 2, 2)).not.toThrow();
    const assignments = heightSortAlgorithm([], 2, 2);
    expect(assignments.every((a) => a.studentId === null)).toBe(true);
  });
});
