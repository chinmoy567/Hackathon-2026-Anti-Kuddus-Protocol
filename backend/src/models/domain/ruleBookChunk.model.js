import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 6 advanced-tier chunks (task2 spec §3) — quotable units of a parent
// rule_book_entries.text. chunkText must be a verbatim substring of the parent's text (grounding
// check enforced at ingest time in scripts/ingestRuleBookChunks.js). No embedding stored here —
// vectors live in the shared Pinecone index, keyed by this document's _id (ISSUES.md Issue 6).
const ruleBookChunkSchema = new mongoose.Schema(
  {
    ruleEntryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "RuleBookEntry" },
    chunkText: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
  },
  { timestamps: true }
);

ruleBookChunkSchema.index({ ruleEntryId: 1, chunkIndex: 1 }, { unique: true });

export const RuleBookChunk = domainConn.model("RuleBookChunk", ruleBookChunkSchema);
