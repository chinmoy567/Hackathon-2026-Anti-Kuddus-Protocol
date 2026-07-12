import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    globalSetup: ["./test/globalSetup.js"],
    setupFiles: ["./test/setupEnv.js"],
    hookTimeout: 30000,
    testTimeout: 15000,
    // Integration tests share one MongoDB test database with no per-file
    // isolation — concurrent files' beforeEach deleteMany() calls race each
    // other. Run test files sequentially instead.
    fileParallelism: false,
  },
});
