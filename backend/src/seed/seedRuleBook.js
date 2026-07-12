import { RuleBookEntry } from "../models/domain/ruleBookEntry.model.js";
import { domainConn } from "../config/db.js";
import { RULE_BOOK_CORPUS } from "../fixtures/ruleBookCorpus.js";

// Mission 6 rulebook seed (task1 spec §3, §6) — idempotent, safe to re-run; upserts by
// `title`. Seeded from the real "Official School Rulebook (Version 1.0)" provided by the user
// (.claude/issues/ISSUES.md Issue 6 resolution) — 25 rules across 7 categories.
// Run with: npm run seed:rulebook

const seed = async () => {
  await domainConn.asPromise();

  const savedDocs = [];
  for (const entry of RULE_BOOK_CORPUS) {
    const doc = await RuleBookEntry.findOneAndUpdate(
      { title: entry.title },
      entry,
      { upsert: true, returnDocument: "after" }
    );
    savedDocs.push(doc);
  }

  console.log(`${savedDocs.length} rule book entries upserted to MongoDB.`);
  console.table(
    savedDocs.map((d) => ({
      title: d.title,
      category: d.category,
      text: d.text.slice(0, 50),
    }))
  );

  await domainConn.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Rulebook seeding failed:", err);
  process.exit(1);
});
