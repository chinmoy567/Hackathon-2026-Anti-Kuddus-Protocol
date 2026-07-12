import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

let io = null;

// Authenticated WebSockets only — unauthenticated sockets are rejected outright
// (System Architecture.md §3.12). Rooms are role-scoped so a domain service can
// fan out an event to exactly the audiences API.md §13 specifies.
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: env.corsOrigin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const payload = jwt.verify(token, env.jwtAccessSecret);
      socket.user = { id: payload.sub, role: payload.role };
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join("all");
    socket.join(`role:${socket.user.role}`);
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized — call initSocket() first");
  return io;
};
