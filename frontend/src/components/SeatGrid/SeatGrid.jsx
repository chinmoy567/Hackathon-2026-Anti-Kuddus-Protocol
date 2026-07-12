import { Desk } from "./Desk.jsx";

const DESK_SIZE = 80; // px, matches Desk.jsx's h-16/w-20 footprint incl. gap-3 (12px)
const GAP = 12;

// Pure layout: front row (row 0) renders nearest the Teacher marker, scrolls
// horizontally at narrow widths so row-order semantics never break (task2 §5).
// Aisle columns render as a gap (no desk at all), distinct from an empty desk.
export const SeatGrid = ({ gridRows, gridCols, teacherPosition, assignments, aisleColumns = [], studentLookup }) => {
  const rows = Array.from({ length: gridRows }, (_, row) => row);
  const cols = Array.from({ length: gridCols }, (_, col) => col);

  const assignmentAt = (row, col) =>
    assignments.find((a) => a.seatRow === row && a.seatCol === col);

  const kuddusSeat = assignments.find((a) => {
    const student = a.studentId ? studentLookup[a.studentId] : null;
    return student?.isKuddus;
  });

  const cellCenter = (row, col) => ({
    x: col * (DESK_SIZE + GAP) + DESK_SIZE / 2,
    y: row * (DESK_SIZE + GAP) + DESK_SIZE / 2,
  });

  const sightLine = kuddusSeat
    ? (() => {
        const from = cellCenter(teacherPosition.row, teacherPosition.col);
        const to = cellCenter(kuddusSeat.seatRow, kuddusSeat.seatCol);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return { from, length, angle };
      })()
    : null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        Teacher
      </div>
      <div className="relative w-max">
        {sightLine && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-0 h-px origin-left bg-slate-300"
            style={{
              left: sightLine.from.x,
              top: sightLine.from.y,
              width: sightLine.length,
              transform: `rotate(${sightLine.angle}deg)`,
            }}
          />
        )}
        <div className="relative z-10 flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row} className="flex gap-3">
              {cols.map((col) => {
                if (aisleColumns.includes(col)) {
                  return <div key={col} className="w-6" aria-hidden="true" />;
                }
                const assignment = assignmentAt(row, col);
                const student = assignment?.studentId ? studentLookup[assignment.studentId] : null;
                return (
                  <Desk
                    key={col}
                    seatRow={row}
                    seatCol={col}
                    studentId={assignment?.studentId ?? null}
                    studentLookup={studentLookup}
                    isTeacherSeat={teacherPosition.row === row && teacherPosition.col === col}
                    isKuddusSeat={Boolean(student?.isKuddus)}
                    occluded={assignment?.occluded ?? false}
                    occlusionReason={assignment?.occlusionReason ?? null}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
