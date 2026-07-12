import { verify } from "../services/factCheck.service.js";
import { domainConn } from "../config/db.js";
import { FACT_CHECK_CURATED_SUITE } from "../fixtures/factCheckCuratedSuite.js";

// Runs the curated suite (task2 spec §7) against the REAL pipeline — real Cohere embeddings,
// real Pinecone, real Groq entailment. Not part of `npm test` (needs live provider credentials
// and burns real API quota); run manually with `npm run test:curated` before a demo/after a
// corpus or threshold change. See fixtures/factCheckCuratedSuite.js for the baseline result.

const run = async () => {
  await domainConn.asPromise();

  let correct = 0;
  const misses = [];

  for (const { claim, expected } of FACT_CHECK_CURATED_SUITE) {
    const result = await verify(claim);
    const isCorrect = result.verdict === expected;
    if (isCorrect) correct += 1;
    else misses.push({ claim, expected, got: result.verdict, confidence: result.confidence });

    console.log(`${isCorrect ? "✅" : "❌"} [${result.verdict}] (conf ${result.confidence}) "${claim}"`);
  }

  console.log(`\n${correct}/${FACT_CHECK_CURATED_SUITE.length} correct (${Math.round((correct / FACT_CHECK_CURATED_SUITE.length) * 100)}%)`);
  if (misses.length > 0) {
    console.log("\nMisses:");
    console.table(misses);
  }

  await domainConn.close();
  process.exit(misses.length > 0 ? 1 : 0);
};

run().catch((err) => {
  console.error("Curated suite run failed:", err);
  process.exit(1);
});
