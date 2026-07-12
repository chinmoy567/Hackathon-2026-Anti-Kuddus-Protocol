import { RuleBookEntry } from "../models/domain/ruleBookEntry.model.js";
import { RuleBookChunk } from "../models/domain/ruleBookChunk.model.js";
import { domainConn } from "../config/db.js";
import { chunkRuleText } from "../utils/chunkText.js";
import * as retrieval from "../services/retrieval.service.js";

// Mission 6 advanced-tier ingestion (task2 spec §2/§6) — idempotent, safe to re-run: upserts
// chunks by (ruleEntryId, chunkIndex), then re-embeds and upserts every chunk to the shared
// Pinecone index (type: "rule"). Requires rule_book_entries to already be seeded
// (npm run seed:rulebook). Currently ingesting the PLACEHOLDER corpus pending the real
// "Official School Rulebook" content (.claude/issues/ISSUES.md Issue 6).
// Run with: npm run ingest:rulebook

const seed = async () => {
  await domainConn.asPromise();

  const entries = await RuleBookEntry.find();
  if (entries.length === 0) {
    console.error("No rule_book_entries found — run `npm run seed:rulebook` first.");
    process.exit(1);
  }

  const savedChunks = [];
  for (const entry of entries) {
    const sentences = chunkRuleText(entry.text);
    for (let chunkIndex = 0; chunkIndex < sentences.length; chunkIndex += 1) {
      const chunkText = sentences[chunkIndex];

      // Grounding check (task2 spec §2/§6) — a chunk that isn't a verbatim substring of its
      // parent must never be persisted; it would make a future "exact quote" claim false.
      if (!entry.text.includes(chunkText)) {
        console.error(`Grounding check failed for "${entry.title}" chunk ${chunkIndex} — skipped.`);
        continue;
      }

      const chunk = await RuleBookChunk.findOneAndUpdate(
        { ruleEntryId: entry._id, chunkIndex },
        { ruleEntryId: entry._id, chunkText, chunkIndex },
        { upsert: true, returnDocument: "after" }
      );
      savedChunks.push(chunk);
    }
  }

  console.log(`${savedChunks.length} rule book chunks upserted to MongoDB. Embedding and upserting to Pinecone...`);
  await retrieval.ingestRuleChunks(savedChunks);

  console.log("Rulebook chunks ingested (MongoDB + Pinecone).");
  console.table(
    savedChunks.map((c) => ({
      ruleEntryId: c.ruleEntryId.toString(),
      chunkIndex: c.chunkIndex,
      chunkText: c.chunkText.slice(0, 60),
    }))
  );

  await domainConn.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Rulebook chunk ingestion failed:", err);
  process.exit(1);
});
