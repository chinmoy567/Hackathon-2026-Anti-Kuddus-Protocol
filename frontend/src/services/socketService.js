import { io } from "socket.io-client";
import { getAccessToken } from "../utils/tokenManager.js";

let socket = null;

// Authenticated WebSocket, per System Architecture.md §3.12 — the handshake
// carries the current access token; `auth` as a function re-reads it on every
// (re)connection attempt so a refreshed token is picked up automatically.
export const connectSocket = () => {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: (cb) => cb({ token: getAccessToken() }),
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
