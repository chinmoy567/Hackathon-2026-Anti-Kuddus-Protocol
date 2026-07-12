import OpenAI from "openai";
import { env } from "./env.js";

// Groq's API is OpenAI-compatible, so the same `openai` SDK works against Groq's endpoint —
// only aiGateway.service.js may import this file (System Architecture.md Decision D4).
export const groqClient = new OpenAI({
  apiKey: env.gorqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});
