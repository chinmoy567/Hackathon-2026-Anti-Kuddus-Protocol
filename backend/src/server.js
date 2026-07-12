import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabases, identityConn, anonymousConn, domainConn } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { scheduleReconciliation } from "./utils/reconcileStrikeCount.js";

// // Some local/ISP DNS resolvers refuse SRV queries (mongodb+srv://) with
// // querySrv ECONNREFUSED. Fall back to public resolvers so Atlas connects.
// dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);

const startServer = async () => {
  try {
    await connectDatabases();

    const httpServer = http.createServer(app);
    initSocket(httpServer);
    scheduleReconciliation();

    httpServer.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });

    // Ensures the port and DB connections are released on restart/exit instead of
    // lingering as an orphan process (the recurring EADDRINUSE cause on Windows).
    const shutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully...`);
      httpServer.close(async () => {
        await Promise.all([identityConn.close(), anonymousConn.close(), domainConn.close()]);
        process.exit(0);
      });
      // Force-exit if close() hangs (e.g. an open socket.io connection).
      setTimeout(() => process.exit(1), 5000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
