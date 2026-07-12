// Curated claim -> expected-verdict pairs (task2 spec §7) — the user's own 30-claim test set
// against the real "Official School Rulebook (Version 1.0)" corpus (ruleBookCorpus.js). Run live
// against the real pipeline (real Cohere embeddings, real Pinecone, real Groq entailment) via
// `npm run test:curated` — not mocked, since the point is to catch real retrieval/entailment
// accuracy regressions that mocked unit tests cannot see.
//
// Baseline result (2026-07-13, threshold 0.6): 26/30 (87%). The 4 misses are a genuine small-
// corpus retrieval-score overlap documented in config/env.js's rulebookSimilarityThreshold
// comment, not a code bug — flagged here so a future threshold/corpus change can be measured
// against this same fixture instead of re-deriving it from scratch.
export const FACT_CHECK_CURATED_SUITE = [
  { claim: "Every student must complete homework.", expected: "TRUE" },
  { claim: "Students cannot charge money for washroom access.", expected: "TRUE" },
  { claim: "Captains must consult other captains before major decisions.", expected: "TRUE" },
  { claim: "Teachers approve examination schedules.", expected: "TRUE" },
  { claim: "Students must follow the official seating arrangement.", expected: "TRUE" },
  { claim: "False school rules are considered misconduct.", expected: "TRUE" },
  { claim: "Students can anonymously report misconduct.", expected: "TRUE" },
  { claim: "No student may steal another student's food.", expected: "TRUE" },
  { claim: "The syllabus should follow the official curriculum.", expected: "TRUE" },
  { claim: "Captains must obey school rules.", expected: "TRUE" },

  { claim: "First Captains never have to do homework.", expected: "FALSE" },
  { claim: "Captains can make decisions without consulting anyone.", expected: "FALSE" },
  { claim: "Students must pay 2 Taka to use the washroom.", expected: "FALSE" },
  { claim: "Captains can collect money whenever they want.", expected: "FALSE" },
  { claim: "The First Captain decides the exam syllabus.", expected: "FALSE" },
  { claim: "Students may sleep during class.", expected: "FALSE" },
  { claim: "Tall students must always sit in the front row.", expected: "FALSE" },
  { claim: "Captains may eat another student's lunch.", expected: "FALSE" },
  { claim: "The barcode on a textbook can be included in exams.", expected: "FALSE" },
  { claim: "The Headmaster allows captains to ignore school rules.", expected: "FALSE" },

  { claim: "The school closes at 4:00 PM.", expected: "UNVERIFIABLE" },
  { claim: "Students may bring laptops every day.", expected: "UNVERIFIABLE" },
  { claim: "The library opens at 7:00 AM.", expected: "UNVERIFIABLE" },
  { claim: "Friday is sports day.", expected: "UNVERIFIABLE" },
  { claim: "Students must wear black shoes only.", expected: "UNVERIFIABLE" },
  { claim: "Every classroom has air conditioning.", expected: "UNVERIFIABLE" },
  { claim: "Mobile phones are allowed after lunch.", expected: "UNVERIFIABLE" },
  { claim: "Students must join at least one club.", expected: "UNVERIFIABLE" },
  { claim: "School buses are free.", expected: "UNVERIFIABLE" },
  { claim: "The canteen sells pizza every Friday.", expected: "UNVERIFIABLE" },
];
