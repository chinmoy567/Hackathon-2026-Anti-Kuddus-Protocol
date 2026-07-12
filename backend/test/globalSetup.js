import { MongoMemoryServer } from "mongodb-memory-server";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Starts one in-memory MongoDB shared by all test files, and writes its URI to
// a gitignored file that setupEnv.js reads synchronously before any test file
// imports app code (env.js fails fast at import time, so this can't be async).
const uriFile = join(dirname(fileURLToPath(import.meta.url)), ".mongo-uri");

export default async function setup() {
  const mongod = await MongoMemoryServer.create();
  writeFileSync(uriFile, mongod.getUri(), "utf-8");

  return async function teardown() {
    await mongod.stop();
  };
}
