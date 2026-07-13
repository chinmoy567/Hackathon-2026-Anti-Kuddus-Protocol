import { motion } from "framer-motion";
import { COMPLAINT_STATUS_LABELS } from "../../utils/constants.js";
import { Button } from "../ui/Button.jsx";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  validated: "bg-emerald-100 text-emerald-800",
  rejected: "bg-slate-200 text-slate-600",
};

// Captains render this read-only; only role=teacher ever sees the action
// buttons — the server rejects a captain's PATCH regardless (API.md §5).
export const ComplaintCard = ({ complaint, canAdjudicate, isUpdating, onValidate, onReject }) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
    className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow duration-150 hover:shadow-md"
  >
    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {complaint.category.replace("_", " ")}
        </p>
        <p className="mt-1 text-sm text-slate-700">{complaint.description}</p>
        {complaint.evidenceFileIds && complaint.evidenceFileIds.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {complaint.evidenceFileIds.map((file) => (
              <a
                key={file._id}
                href={file.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={file.cloudinaryUrl}
                  alt="Evidence"
                  className="h-20 w-20 rounded border border-slate-300 object-cover hover:shadow-md transition-shadow"
                />
              </a>
            ))}
          </div>
        )}
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
        {COMPLAINT_STATUS_LABELS[complaint.status]}
      </span>
    </div>
    {canAdjudicate && complaint.status === "pending" && (
      <div className="mt-3 flex gap-2">
        <Button variant="success" disabled={isUpdating} onClick={() => onValidate(complaint._id)}>
          Validate
        </Button>
        <Button variant="danger" disabled={isUpdating} onClick={() => onReject(complaint._id)}>
          Reject
        </Button>
      </div>
    )}
  </motion.div>
);
