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
// metadata = { courseCode, subject, chapter } (small, for optional pre-filtering; topicText/
// sourceRef are always re-fetched from Mongo, never duplicated here as source of truth).
export const ingest = async (curriculumTopics) => {
  const store = await getVectorStore();
  const vectors = [];
  const documents = [];

  for (const topic of curriculumTopics) {
    const vector = await aiGateway.embed(topic.topicText);
    vectors.push(vector);
    documents.push({
      pageContent: topic.topicText,
      metadata: { courseCode: topic.courseCode, subject: topic.subject, chapter: topic.chapter },
      id: topic._id.toString(),
    });
  }

  await store.addVectors(vectors, documents, { ids: documents.map((d) => d.id) });
};

// Request-time — embeds the query text and runs a Pinecone similarity search. Returns
// { mongoId, score }[]; the caller resolves full curriculum_topics docs from Mongo and applies
// the similarity threshold + examFrequency/examsAvailable ratio tie-break (syllabus.service.js).
export const query = async (text, { topK = 3 } = {}) => {
  const store = await getVectorStore();
  const vector = await aiGateway.embed(text);
  const results = await store.similaritySearchVectorWithScore(vector, topK);

  return results.map(([document, score]) => ({
    mongoId: document.id,
    score,
  }));
};
