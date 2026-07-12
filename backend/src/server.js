import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabases } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { scheduleReconciliation } from "./utils/reconcileStrikeCount.js";

const startServer = async () => {
  try {
    await connectDatabases();

    const httpServer = http.createServer(app);
    initSocket(httpServer);
    scheduleReconciliation();

    httpServer.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
