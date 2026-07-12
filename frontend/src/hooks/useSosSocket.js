import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { apiSlice } from "../store/apiSlice.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import { useToast } from "../components/ui/Toast.jsx";

// Subscribes to sos:new/acknowledged/resolved (API.md §13) and invalidates
// the RTK Query cache so GET /sos/active re-fetches — new alerts also flash
// a toast so a captain sees it even if they're not looking at the list.
export const useSosSocket = () => {
  const dispatch = useDispatch();
  const socket = useSocketContext();
  const { push } = useToast();

  useEffect(() => {
    if (!socket) return undefined;

    const invalidate = () => dispatch(apiSlice.util.invalidateTags(["SosAlerts"]));
    const handleNew = (payload) => {
      invalidate();
      push(`SOS: ${payload.student?.name ?? "A student"} at ${payload.location}!`, "error");
    };

    socket.on("sos:new", handleNew);
    socket.on("sos:acknowledged", invalidate);
    socket.on("sos:resolved", invalidate);

    return () => {
      socket.off("sos:new", handleNew);
      socket.off("sos:acknowledged", invalidate);
      socket.off("sos:resolved", invalidate);
    };
  }, [socket, dispatch, push]);
};
