import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "../store/apiSlice.js";
import { useSocketContext } from "../context/SocketContext.jsx";

const POLL_INTERVAL_MS = 15000;

// Subscribes to `strike:updated` and patches the RTK Query cache directly —
// no separate "live strike count" slice (claude.md: never duplicate state).
// Falls back to polling GET /dashboard/strike-state while disconnected
// (System Architecture.md D5).
export const useSocket = () => {
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
        dispatch(apiSlice.util.invalidateTags(["StrikeState"]));
      }, POLL_INTERVAL_MS);
    };

    const handleStrikeUpdated = (payload) => {
      dispatch(
        apiSlice.util.updateQueryData("getStrikeState", undefined, (draft) => {
          Object.assign(draft, payload);
        })
      );
    };

    socket.on("connect", stopPolling);
    socket.on("disconnect", startPolling);
    socket.on("strike:updated", handleStrikeUpdated);

    if (!socket.connected) startPolling();

    return () => {
      socket.off("connect", stopPolling);
      socket.off("disconnect", startPolling);
      socket.off("strike:updated", handleStrikeUpdated);
      stopPolling();
    };
  }, [socket, dispatch]);
};
