import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "../config/pinecone.js";
import * as aiGateway from "../services/aiGateway.service.js";

// Memoized singleton — never reconstructed per call. Embeddings are already computed by
// aiGateway.embed() before reaching this store, so a dummy embeddings object satisfies the
// constructor without LangChain ever making its own OpenAI call (keeps the AI Gateway the
// single chokepoint, System Architecture.md Decision D4).
let vectorStorePromise = null;
const getVectorStore = () => {
  if (!vectorStorePromise) {
    vectorStorePromise = PineconeStore.fromExistingIndex(
      { embedQuery: () => { throw new Error("Unused — embeddings are precomputed via aiGateway.embed()."); } },
      { pineconeIndex }
    );
  }
  return vectorStorePromise;
};

// Tie-break margin for near-equal similarity scores (retrieval.service query() consumers) —
// exported so syllabus.service.js and tests share one constant.
export const SIMILARITY_TIE_BREAK_MARGIN = 0.02;

// Seed-time only — embeds each topic's text and upserts to Pinecone, id = Mongo _id (string),
// metadata = { type: "curriculum", courseCode, subject, chapter } (small, for optional
// pre-filtering; topicText/sourceRef are always re-fetched from Mongo, never duplicated here as
// source of truth). `type: "curriculum"` lets Mission 6's rulebook query() filter these out of
// its results — this index is shared between both missions (ISSUES.md Issue 6).
export const ingest = async (curriculumTopics) => {
  const store = await getVectorStore();
  const vectors = [];
  const documents = [];

  for (const topic of curriculumTopics) {
    const vector = await aiGateway.embed(topic.topicText);
    vectors.push(vector);
    documents.push({
      pageContent: topic.topicText,
      metadata: {
        type: "curriculum",
        courseCode: topic.courseCode,
        subject: topic.subject,
        chapter: topic.chapter,
      },
      id: topic._id.toString(),
    });
  }

  await store.addVectors(vectors, documents, { ids: documents.map((d) => d.id) });
};

// Request-time — embeds the query text and runs a Pinecone similarity search, optionally
// restricted to a metadata filter (e.g. { type: "rule" } so Mission 6 never sees Mission 3's
// curriculum vectors, task2 spec §2/§6). Returns { mongoId, score }[]; the caller resolves full
// docs from Mongo and applies its own similarity threshold + any tie-break logic.
export const query = async (text, { topK = 3, filter } = {}) => {
  const store = await getVectorStore();
  const vector = await aiGateway.embed(text);
  const results = await store.similaritySearchVectorWithScore(vector, topK, filter);

  return results.map(([document, score]) => ({
    mongoId: document.id,
    score,
  }));
};

// Seed-time only — Mission 6 rulebook chunks, sharing this same Pinecone index with a
// `type: "rule"` metadata discriminator (task2 spec §2/§3, ISSUES.md Issue 6). id = Mongo
// rule_book_chunks._id (string), never re-embedded on a verify request.
export const ingestRuleChunks = async (ruleBookChunks) => {
  const store = await getVectorStore();
  const vectors = [];
  const documents = [];

  for (const chunk of ruleBookChunks) {
    const vector = await aiGateway.embed(chunk.chunkText);
    vectors.push(vector);
    documents.push({
      pageContent: chunk.chunkText,
      metadata: { type: "rule", ruleEntryId: chunk.ruleEntryId.toString() },
      id: chunk._id.toString(),
    });
  }

  await store.addVectors(vectors, documents, { ids: documents.map((d) => d.id) });
};

// Request-time — Mission 6 semantic verify, always filtered to this mission's own vectors.
export const queryRuleChunks = (text, { topK = 3 } = {}) =>
  query(text, { topK, filter: { type: "rule" } });
