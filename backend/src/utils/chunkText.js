// Splits rule text into quotable sentence-level chunks (task2 spec §2/§6). Every chunk is a
// verbatim substring of the source text by construction (sentence split, not paraphrase), so the
// grounding check downstream is a formality, not a real risk — but ingestRuleBookChunks.js still
// re-verifies it, since the source of truth for "grounded" is the substring check, not this
// function's correctness.
export const chunkRuleText = (text) => {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences.length > 0 ? sentences : [text.trim()];
};
