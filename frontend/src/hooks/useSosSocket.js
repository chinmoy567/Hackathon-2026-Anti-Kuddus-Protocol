import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "../store/apiSlice.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";

const POLL_INTERVAL_MS = 15000;

// Subscribes to sos:new/acknowledged/resolved (API.md §13) and invalidates
// the RTK Query cache so GET /sos/active re-fetches — new alerts also flash
// a toast so a captain sees it even if they're not looking at the list.
// Falls back to polling GET /sos/active while disconnected (same resilience
// pattern as useLedgerSocket.js, per System Architecture.md §3.12's "degrade
// to a polling fallback if the venue network blocks persistent connections").
export const useSosSocket = () => {
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const { push } = useToast();
  const pollRef = useRef(null);

  useEffect(() => {
    if (!socket) return undefined;

    const invalidate = () => dispatch(apiSlice.util.invalidateTags(["SosAlerts"]));

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(invalidate, POLL_INTERVAL_MS);
    };

    const handleNew = (payload) => {
      invalidate();
      push(`SOS: ${payload.student?.name ?? "A student"} at ${payload.location}!`, "error");
    };

    socket.on("connect", stopPolling);
    socket.on("disconnect", startPolling);
    socket.on("sos:new", handleNew);
    socket.on("sos:acknowledged", invalidate);
    socket.on("sos:resolved", invalidate);

    if (!socket.connected) startPolling();

    return () => {
      socket.off("connect", stopPolling);
      socket.off("disconnect", startPolling);
      socket.off("sos:new", handleNew);
      socket.off("sos:acknowledged", invalidate);
      socket.off("sos:resolved", invalidate);
      stopPolling();
    };
  }, [socket, dispatch, push]);
};
