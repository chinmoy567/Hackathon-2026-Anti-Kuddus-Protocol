import mongoose from "mongoose";
import { env } from "./env.js";

// Three independent Mongoose connections — one per store (Identity / Anonymous /
// Domain). Deliberately NOT a single shared connection: `ISSUES.md` Issue 1 requires
// the two-plane anonymity separation to be enforced by code discipline, and giving
// each store its own connection object makes a cross-store query a hard error
// (wrong model bound to wrong connection) rather than a silent possibility.
export const identityConn = mongoose.createConnection(env.mongoBaseUri, {
  dbName: env.mongoDbIdentity,
});

export const anonymousConn = mongoose.createConnection(env.mongoBaseUri, {
  dbName: env.mongoDbAnonymous,
});

export const domainConn = mongoose.createConnection(env.mongoBaseUri, {
  dbName: env.mongoDbDomain,
});

// Awaits all three connections before the server starts accepting traffic.
export const connectDatabases = async () => {
  await Promise.all([
    identityConn.asPromise(),
    anonymousConn.asPromise(),
    domainConn.asPromise(),
  ]);
  console.log(
    `MongoDB connected: ${env.mongoDbIdentity}, ${env.mongoDbAnonymous}, ${env.mongoDbDomain}`
  );
};
