import { Desk } from "./Desk.jsx";

// Pure layout: front row (row 0) renders nearest the Teacher marker, scrolls
// horizontally at narrow widths so row-order semantics never break (task2 §5).
export const SeatGrid = ({ gridRows, gridCols, teacherPosition, assignments, studentLookup }) => {
  const rows = Array.from({ length: gridRows }, (_, row) => row);
  const cols = Array.from({ length: gridCols }, (_, col) => col);

  const assignmentAt = (row, col) =>
    assignments.find((a) => a.seatRow === row && a.seatCol === col);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        Teacher
      </div>
      <div className="flex w-max flex-col gap-3">
        {rows.map((row) => (
          <div key={row} className="flex gap-3">
            {cols.map((col) => {
              const assignment = assignmentAt(row, col);
              return (
                <Desk
                  key={col}
                  seatRow={row}
                  seatCol={col}
                  studentId={assignment?.studentId ?? null}
                  studentLookup={studentLookup}
                  isTeacherSeat={teacherPosition.row === row && teacherPosition.col === col}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
