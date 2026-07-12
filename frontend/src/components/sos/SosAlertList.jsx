import { useSelector } from "react-redux";
import { useGetActiveSosQuery, useAcknowledgeSosMutation, useResolveSosMutation } from "../../store/apiSlice.js";
import { selectCurrentUser } from "../../store/authSlice.js";
import { SosAlertCard } from "./SosAlertCard.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { useToast } from "../ui/Toast.jsx";

// Only captain_2nd/captain_3rd can acknowledge/resolve; teacher sees the
// same list read-only (API.md §11 PATCH endpoints).
export const SosAlertList = () => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetActiveSosQuery();
  const [acknowledge, { isLoading: isAcknowledging }] = useAcknowledgeSosMutation();
  const [resolve, { isLoading: isResolving }] = useResolveSosMutation();
  const { push } = useToast();

  const canAct = user?.role === "captain_2nd" || user?.role === "captain_3rd";

  const handleAcknowledge = async (id) => {
    try {
      await acknowledge(id).unwrap();
      push("Alert acknowledged.", "success");
    } catch (err) {
      push(err?.message || "Could not acknowledge alert.", "error");
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolve(id).unwrap();
      push("Alert resolved.", "success");
    } catch (err) {
      push(err?.message || "Could not resolve alert.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">
        Failed to load SOS alerts.
      </p>
    );
  }

  if (data.alerts.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No active SOS alerts.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.alerts.map((alert) => (
        <SosAlertCard
          key={alert.id}
          alert={alert}
          canAct={canAct}
          isUpdating={isAcknowledging || isResolving}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
        />
      ))}
    </div>
  );
};
