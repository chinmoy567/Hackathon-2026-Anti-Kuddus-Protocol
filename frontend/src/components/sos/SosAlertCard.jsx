import { Button } from "../ui/Button.jsx";

const STATUS_STYLES = {
  active: "bg-rose-100 text-rose-800",
  acknowledged: "bg-amber-100 text-amber-800",
};

const STATUS_LABELS = {
  active: "Active",
  acknowledged: "Acknowledged",
};

// Read by captain_2nd/captain_3rd/teacher only — captain_1st never reaches
// this component (API.md §11 GET /sos/active excludes captain_1st entirely).
export const SosAlertCard = ({ alert, canAct, isUpdating, onAcknowledge, onResolve }) => (
  <div
    className={`rounded-xl border p-4 transition-shadow duration-150 hover:shadow-md ${
      alert.status === "active" ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{alert.student.name}</p>
        <p className="text-xs text-slate-500">{alert.student.rollNumber}</p>
        <p className="mt-1 text-sm text-slate-700">
          Location: <span className="font-medium">{alert.location}</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{new Date(alert.occurredAt).toLocaleTimeString()}</p>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[alert.status]}`}>
        {STATUS_LABELS[alert.status]}
      </span>
    </div>
    {canAct && (
      <div className="mt-3 flex gap-2">
        {alert.status === "active" && (
          <Button variant="secondary" disabled={isUpdating} onClick={() => onAcknowledge(alert.id)}>
            Acknowledge
          </Button>
        )}
        <Button variant="success" disabled={isUpdating} onClick={() => onResolve(alert.id)}>
          Resolve
        </Button>
      </div>
    )}
  </div>
);
