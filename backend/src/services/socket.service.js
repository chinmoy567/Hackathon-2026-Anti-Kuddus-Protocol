import { getIO } from "../config/socket.js";

// The only Mission 1 real-time event (API.md §13) — pushed to every dashboard.
export const emitStrikeUpdated = (payload) => {
  try {
    getIO().to("all").emit("strike:updated", payload);
  } catch {
    // Socket.IO not initialized (e.g. during tests) — the REST write already
    // succeeded and remains the source of truth; clients re-fetch on reconnect.
  }
};
