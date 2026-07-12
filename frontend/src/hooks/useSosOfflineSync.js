import { useEffect, useRef } from "react";
import { useSendSosMutation } from "../store/apiSlice.js";
import { getQueue, removeFromQueue } from "../utils/sosOfflineQueue.js";

// Drains the offline SOS queue on mount and on the browser's `online` event
// (Mission 5 Task 3). Replays each queued alert through the same POST /sos
// mutation the online path uses — the server's (studentId, clientEventId)
// idempotency (database.md §6.4) makes replay safe even on retry.
export const useSosOfflineSync = () => {
  const [sendSos] = useSendSosMutation();
  const isDrainingRef = useRef(false);

  useEffect(() => {
    const drainQueue = async () => {
      if (isDrainingRef.current) return;
      isDrainingRef.current = true;

      try {
        // Oldest first — occurredAt order, matching the order the emergencies happened.
        const queue = [...getQueue()].sort((a, b) => new Date(a.occurredAt) - new Date(b.occurredAt));

        for (const entry of queue) {
          try {
            await sendSos(entry).unwrap();
            removeFromQueue(entry.clientEventId);
          } catch {
            // Still offline (or another failure) — stop draining, leave the
            // rest queued. Don't burn through retries in a tight loop; the
            // next `online` event or component remount tries again.
            break;
          }
        }
      } finally {
        isDrainingRef.current = false;
      }
    };

    drainQueue();
    window.addEventListener("online", drainQueue);
    return () => window.removeEventListener("online", drainQueue);
  }, [sendSos]);
};
