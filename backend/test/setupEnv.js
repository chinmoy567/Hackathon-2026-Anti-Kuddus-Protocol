import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Runs before any test file imports app code — env.js fails fast if these are
// missing, so values must exist before the first import resolves. The URI
// comes from test/globalSetup.js, which starts mongodb-memory-server once for
// the whole run and writes its address here before any worker starts.
const uriFile = join(dirname(fileURLToPath(import.meta.url)), ".mongo-uri");

process.env.NODE_ENV = "test";
process.env.MONGO_BASE_URI = readFileSync(uriFile, "utf-8").trim();
process.env.MONGO_DB_IDENTITY = "antikuddus_identity_test";
process.env.MONGO_DB_ANONYMOUS = "antikuddus_anonymous_test";
process.env.MONGO_DB_DOMAIN = "antikuddus_domain_test";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "test-access-secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test-refresh-secret";
process.env.CORS_ORIGIN = "http://localhost:5173";
