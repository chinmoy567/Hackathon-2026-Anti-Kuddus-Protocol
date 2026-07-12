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

// Mission 5 (API.md §13) — sos:new fans out to captain_2nd/captain_3rd only,
// never captain_1st (Kuddus is deliberately routed around).
export const emitSosNew = (payload) => {
  try {
    getIO().to("role:captain_2nd").to("role:captain_3rd").emit("sos:new", payload);
  } catch {
    // Socket.IO not initialized — REST write already succeeded.
  }
};

export const emitSosAcknowledged = (payload) => {
  try {
    getIO().to("role:captain_2nd").to("role:captain_3rd").to("role:teacher").emit("sos:acknowledged", payload);
  } catch {
    // Socket.IO not initialized — REST write already succeeded.
  }
};

export const emitSosResolved = (payload) => {
  try {
    getIO().to("role:captain_2nd").to("role:captain_3rd").to("role:teacher").emit("sos:resolved", payload);
  } catch {
    // Socket.IO not initialized — REST write already succeeded.
  }
};

// Mission 4 (API.md §"Real-Time Events") — pushed to every dashboard.
export const emitLedgerUpdated = (payload) => {
  try {
    getIO().to("all").emit("ledger:updated", payload);
  } catch {
    // Socket.IO not initialized — REST write already succeeded.
  }
};
