import { env } from "./env.js";

// Cohere's embed API — plain REST call via fetch, no SDK dependency (matches the codebase's
// "avoid a dependency for something this small" convention, utils/parseDuration.js). Only
// aiGateway.service.js may import this file (System Architecture.md Decision D4).
const COHERE_EMBED_URL = "https://api.cohere.com/v2/embed";

export const cohereEmbed = async (text) => {
  const response = await fetch(COHERE_EMBED_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.cohereApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.cohereEmbeddingModel,
      texts: [text],
      input_type: "search_document",
      embedding_types: ["float"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere embed request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.embeddings.float[0];
};
