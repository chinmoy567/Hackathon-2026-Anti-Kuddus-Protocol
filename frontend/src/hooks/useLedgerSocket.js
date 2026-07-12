import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "../store/apiSlice.js";
import { useSocketContext } from "../context/SocketContext.jsx";

const POLL_INTERVAL_MS = 15000;

// Subscribes to `ledger:updated` and patches the getLedgerSummary("day") cache
// entry's running totals directly — mirrors useSocket.js's shape exactly.
// Falls back to polling GET /ledger/summary while disconnected (same
// resilience pattern as the strike bar, per task2-ledger-analytics.md §2).
// The per-bucket `series` array is left to the next full re-fetch (poll or
// tag invalidation) rather than patched incrementally — the payload only
// carries the two running totals, not a bucket to append to.
export const useLedgerSocket = () => {
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const pollRef = useRef(null);

  useEffect(() => {
    if (!socket) return undefined;

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(() => {
        dispatch(apiSlice.util.invalidateTags(["LedgerSummary"]));
      }, POLL_INTERVAL_MS);
    };

    const handleLedgerUpdated = (payload) => {
      dispatch(
        apiSlice.util.updateQueryData("getLedgerSummary", "day", (draft) => {
          draft.cashTotal = payload.cashTotal;
          draft.foodTotal = payload.foodTotal;
        })
      );
    };

    socket.on("connect", stopPolling);
    socket.on("disconnect", startPolling);
    socket.on("ledger:updated", handleLedgerUpdated);

    if (!socket.connected) startPolling();

    return () => {
      socket.off("connect", stopPolling);
      socket.off("disconnect", startPolling);
      socket.off("ledger:updated", handleLedgerUpdated);
      stopPolling();
    };
  }, [socket, dispatch]);
};
