import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./env.js";

// Single Pinecone client + resolved index handle — only retrieval.service.js and
// aiGateway.service.js may import this file (System Architecture.md Decision D4).
const pineconeClient = new Pinecone({ apiKey: env.pineconeApiKey });

export const pineconeIndex = pineconeClient.index(env.pineconeIndexName);
