import { describe, it, expect } from "vitest";
import { isOccluded, buildOcclusionReason } from "../../src/services/seatPlanning/occlusion.util.js";

describe("isOccluded", () => {
  it("occludes when a student sits strictly between teacher and Kuddus on the ray column", () => {
    const result = isOccluded({
      teacherPosition: { row: 0, col: 2 },
      kuddusSeat: { row: 4, col: 2 },
      candidateSeat: { row: 2, col: 2 },
    });
    expect(result).toBe(true);
  });

  it("does not occlude when no student sits on the ray path", () => {
    const result = isOccluded({
      teacherPosition: { row: 0, col: 2 },
      kuddusSeat: { row: 4, col: 2 },
      candidateSeat: { row: 2, col: 4 },
    });
    expect(result).toBe(false);
  });

  it("aisle columns never occlude", () => {
    const result = isOccluded({
      teacherPosition: { row: 0, col: 2 },
      kuddusSeat: { row: 4, col: 2 },
      candidateSeat: { row: 2, col: 2 },
      aisleColumns: [2],
    });
    expect(result).toBe(false);
  });

  it("is trivially not occluded when teacher and Kuddus share a row (no rows strictly between)", () => {
    const result = isOccluded({
      teacherPosition: { row: 2, col: 0 },
      kuddusSeat: { row: 2, col: 4 },
      candidateSeat: { row: 2, col: 2 },
    });
    expect(result).toBe(false);
  });

  it("respects diagonal ray interpolation, not just same-column blocking", () => {
    const result = isOccluded({
      teacherPosition: { row: 0, col: 0 },
      kuddusSeat: { row: 4, col: 4 },
      candidateSeat: { row: 2, col: 2 },
    });
    expect(result).toBe(true);
  });
});

describe("buildOcclusionReason", () => {
  it("returns null when there is no blocking student", () => {
    expect(buildOcclusionReason(null, null)).toBeNull();
  });

  it("returns a human-readable reason naming the blocking student and seat", () => {
    const reason = buildOcclusionReason({ name: "Charlie", rollNumber: "003" }, { row: 1, col: 2 });
    expect(reason).toContain("Charlie");
    expect(reason).toContain("003");
    expect(reason).toContain("row 2");
    expect(reason).toContain("seat 3");
  });
});
