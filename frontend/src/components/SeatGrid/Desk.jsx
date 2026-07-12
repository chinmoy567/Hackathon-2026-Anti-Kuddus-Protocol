import { useState } from "react";

// One desk cell — click reveals Name/Roll/Height (task2 §1 interactive requirement),
// plus occlusion rationale when this seat blocks the teacher's sight line to Kuddus (Task 3).
export const Desk = ({
  seatRow,
  seatCol,
  studentId,
  studentLookup,
  isTeacherSeat,
  isKuddusSeat = false,
  occluded = false,
  occlusionReason = null,
}) => {
  const [open, setOpen] = useState(false);
  const student = studentId ? studentLookup[studentId] : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => student && setOpen((prev) => !prev)}
        onBlur={() => setOpen(false)}
        className={`flex h-16 w-20 flex-col items-center justify-center rounded-xl border text-xs transition-colors
          ${student
            ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            : "border-dashed border-slate-200 bg-slate-50 text-slate-300"}
          ${occluded ? "border-amber-400 ring-1 ring-amber-300" : ""}
          ${isTeacherSeat ? "ring-2 ring-slate-900" : ""}
          ${isKuddusSeat ? "ring-2 ring-rose-500" : ""}`}
      >
        {student ? (
          <>
            <span className="font-medium text-slate-900">
              #{student.rollNumber}
              {isKuddusSeat ? " 👑" : ""}
            </span>
            <span className="truncate px-1">{student.name}</span>
          </>
        ) : (
          <span>Empty</span>
        )}
      </button>

      {open && student && (
        <div
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200
            bg-white p-3 text-xs text-slate-700 shadow-lg"
        >
          <p className="font-medium text-slate-900">{student.name}</p>
          <p>Roll: {student.rollNumber}</p>
          <p>Height: {student.heightCm} cm</p>
          <p className="mt-1 text-slate-400">Seat {seatRow + 1}, {seatCol + 1}</p>
          {occluded && occlusionReason && (
            <p className="mt-2 border-t border-amber-200 pt-2 text-amber-700">{occlusionReason}</p>
          )}
        </div>
      )}
    </div>
  );
};
