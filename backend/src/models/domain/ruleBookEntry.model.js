import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 6 pre-seeded rulebook (task1 spec §3) — source of truth for verbatim rule text.
// Baseline search runs a MongoDB $text query against title/text/keywords; keywords supports
// forgiving matching beyond what $text tokenizes from title/text alone.
const ruleBookEntrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

ruleBookEntrySchema.index(
  { title: "text", keywords: "text", text: "text" },
  { weights: { title: 10, keywords: 5, text: 1 } }
);
ruleBookEntrySchema.index({ category: 1 });

export const RuleBookEntry = domainConn.model("RuleBookEntry", ruleBookEntrySchema);
