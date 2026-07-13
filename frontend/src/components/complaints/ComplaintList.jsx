import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useGetComplaintsQuery, useUpdateComplaintStatusMutation } from "../../store/apiSlice.js";
import { selectCurrentUser } from "../../store/authSlice.js";
import { ComplaintCard } from "./ComplaintCard.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { useToast } from "../ui/Toast.jsx";
import { staggerParent, staggerItem } from "../../utils/motion.js";

// Teacher/captain_2nd/captain_3rd only — captain_1st never reaches this
// component (AppLayout omits the nav path; the server would 403 regardless).
export const ComplaintList = () => {
  const user = useSelector(selectCurrentUser);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetComplaintsQuery({ status: status || undefined, page, limit: 10 });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateComplaintStatusMutation();
  const { push } = useToast();

  const canAdjudicate = user?.role === "teacher";

  const handleAdjudicate = async (id, nextStatus) => {
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      push(`Complaint ${nextStatus}.`, "success");
    } catch (err) {
      push(err?.message || "Could not update complaint.", "error");
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Complaints</h2>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition-colors
            duration-150 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:w-auto"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">
          Failed to load complaints.
        </p>
      ) : data.items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No complaints yet.
        </p>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={staggerParent}
        >
          <AnimatePresence initial={false}>
            {data.items.map((complaint) => (
              <motion.div
                key={complaint._id}
                layout
                variants={staggerItem}
                exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
              >
                <ComplaintCard
                  complaint={complaint}
                  canAdjudicate={canAdjudicate}
                  isUpdating={isUpdating}
                  onValidate={(id) => handleAdjudicate(id, "validated")}
                  onReject={(id) => handleAdjudicate(id, "rejected")}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-300 px-3 py-1 transition-colors duration-150 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            Prev
          </button>
          <span className="px-2 py-1 text-slate-500">
            Page {page} of {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1 transition-colors duration-150 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
