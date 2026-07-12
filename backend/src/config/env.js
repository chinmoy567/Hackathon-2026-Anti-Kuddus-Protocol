import dotenv from "dotenv";

dotenv.config();

// Required at boot — fail fast rather than surface a confusing error mid-request.
const REQUIRED_VARS = [
  "MONGO_BASE_URI",
  "MONGO_DB_IDENTITY",
  "MONGO_DB_ANONYMOUS",
  "MONGO_DB_DOMAIN",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "GORQ_API_KEY",
  "PINECONE_API_KEY",
  "PINECONE_INDEX_NAME",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoBaseUri: process.env.MONGO_BASE_URI,
  mongoDbIdentity: process.env.MONGO_DB_IDENTITY,
  mongoDbAnonymous: process.env.MONGO_DB_ANONYMOUS,
  mongoDbDomain: process.env.MONGO_DB_DOMAIN,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  loginRateLimit: {
    max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
    windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  },
  tokenIssuanceRateLimit: {
    max: Number(process.env.TOKEN_ISSUANCE_RATE_LIMIT_MAX) || 5,
    windowMs: Number(process.env.TOKEN_ISSUANCE_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000,
  },
  sosRateLimit: {
    max: Number(process.env.SOS_RATE_LIMIT_MAX) || 10,
    windowMs: Number(process.env.SOS_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  },

  // Groq — OpenAI-compatible chat completions, free tier, no billing required. Replaces
  // OpenAI as the AI Gateway's chat provider (embeddings still need a working provider —
  // see openaiApiKey below, kept for that path until an alternative is wired).
  gorqApiKey: process.env.GORQ_API_KEY,
  gorqChatModel: process.env.GORQ_CHAT_MODEL || "llama-3.3-70b-versatile",
  // Structured-output (json_schema) calls need a model that supports it — llama-3.3 does
  // not (confirmed via direct test); openai/gpt-oss-120b does. Used only by
  // studyPlan.service.js#generatePlan()'s ChatOpenAI.withStructuredOutput() call.
  gorqStructuredOutputModel: process.env.GORQ_STRUCTURED_OUTPUT_MODEL || "openai/gpt-oss-120b",

  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiChatModel: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",

  syllabusRateLimit: {
    max: Number(process.env.SYLLABUS_RATE_LIMIT_MAX) || 10,
    windowMs: Number(process.env.SYLLABUS_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000,
  },

  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeIndexName: process.env.PINECONE_INDEX_NAME,
  openaiEmbeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  // Recalibrated for Cohere embed-english-v3.0 (was 0.75, tuned for OpenAI text-embedding-3-small
  // — Cohere's cosine scores run lower for the same semantic match: real curriculum topics
  // scored ~0.67-0.71, genuinely non-examinable items ~0.43-0.50, sampled directly against the
  // live seeded index). 0.6 sits in the gap between those two clusters.
  curriculumSimilarityThreshold: Number(process.env.CURRICULUM_SIMILARITY_THRESHOLD) || 0.6,

  // Mission 6 fact-check threshold — calibrated 2026-07-13 against the real 25-rule corpus
  // (backend/src/fixtures/ruleBookCorpus.js) using the user's own 30-claim curated test set.
  // Relevant-rule top-1 scores ranged ~0.52-0.88; no-match top-1 scores ranged ~0.45-0.62 — the
  // two clusters genuinely overlap in the 0.52-0.62 band on this small, single-sentence-chunk
  // corpus, so no threshold value gets a clean split. 0.6 sits in the middle of the overlap and
  // was measured to produce 26/30 (87%) on the curated suite; a stricter or looser value trades
  // one failure mode for the other, it does not eliminate the overlap. Revisit if the corpus
  // grows or chunks become longer/richer (more context per chunk usually widens the score gap).
  rulebookSimilarityThreshold: Number(process.env.RULEBOOK_SIMILARITY_THRESHOLD) || 0.6,

  // Cohere — free-tier embeddings (Groq has no embeddings endpoint). embed-english-v3.0 is
  // 1024-dim, different from OpenAI's 1536-dim — the Pinecone index must be created/recreated
  // at 1024 dimensions before this is usable. Not in REQUIRED_VARS yet: optional until a real
  // key is provided, so the app still boots without it (Task 1/3 chat features work either way).
  cohereApiKey: process.env.COHERE_API_KEY,
  cohereEmbeddingModel: process.env.COHERE_EMBEDDING_MODEL || "embed-english-v3.0",

  studyPlan: {
    defaultHoursPerDay: Number(process.env.STUDY_PLAN_DEFAULT_HOURS_PER_DAY) || 2,
    minHoursPerDay: 1,
    maxHoursPerDay: 16,
    weakSubjectMultiplier: Number(process.env.STUDY_PLAN_WEAK_SUBJECT_MULTIPLIER) || 1.5,
    examFrequencyNudgeMultiplier: Number(process.env.STUDY_PLAN_EXAM_FREQUENCY_NUDGE_MULTIPLIER) || 1.15,
    minBlockMinutes: Number(process.env.STUDY_PLAN_MIN_BLOCK_MINUTES) || 10,
  },
};
