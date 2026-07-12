import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    globalSetup: ["./test/globalSetup.js"],
    setupFiles: ["./test/setupEnv.js"],
    hookTimeout: 30000,
    testTimeout: 15000,
  },
});
