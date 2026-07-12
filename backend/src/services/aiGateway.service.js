import { groqClient } from "../config/groq.js";
import { cohereEmbed } from "../config/cohere.js";
import { env } from "../config/env.js";
import { AiProviderError } from "../utils/errors.js";

// Cost-control cap shared with request validation (syllabus.validation.js) — kept here too
// so the gateway never trusts a caller blindly (defense in depth, task1 spec §2).
export const MAX_SYLLABUS_TEXT_LENGTH = 5000;

// The only module that imports config/groq.js and config/cohere.js — System Architecture.md
// Decision D4: exactly one module holds provider keys and mediates every LLM/embedding call.
// Chat completions run on Groq; embeddings run on Cohere (embed() below) — both free tier,
// no billing required. See .claude/issues/ISSUES.md for the provider-switch rationale.
export const chat = async ({ systemPrompt, userText, maxOutputTokens = 800 }) => {
  if (userText.length > MAX_SYLLABUS_TEXT_LENGTH) {
    throw new AiProviderError("Input text exceeds the maximum allowed length.");
  }

  try {
    // userText is always a separate user-role message, never concatenated into the
    // system prompt — this is the actual mechanism behind "data, never instructions"
    // (prompt-injection containment, Requirements Report.md §Mission 3 Security Concerns).
    const response = await groqClient.chat.completions.create({
      model: env.gorqChatModel,
      max_tokens: maxOutputTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    });

    return response.choices[0]?.message?.content ?? "";
  } catch {
    // Never let a raw provider SDK error escape — the controller layer only ever sees
    // AiProviderError, never a provider-shaped object.
    throw new AiProviderError();
  }
};

// Embedding dimension expected by the seeded Pinecone index (task2 plan §3.3) — a mismatch
// here would silently corrupt the vector index, so embed() validates against this before
// returning rather than letting a bad vector reach Pinecone. Cohere's embed-english-v3.0 is
// 1024-dim (was 1536 under OpenAI — the Pinecone index must be rebuilt at this dimension).
export const EXPECTED_EMBEDDING_DIMENSION = 1024;

// The only module (besides retrieval.service.js's Pinecone calls) that touches embeddings —
// still gated behind the AI Gateway, same D4 chokepoint as chat(). Cohere free tier (Groq has
// no embeddings endpoint — see .claude/issues/ISSUES.md for the provider-switch rationale).
export const embed = async (text) => {
  if (!env.cohereApiKey) {
    throw new AiProviderError("No embeddings provider is configured.");
  }

  try {
    const vector = await cohereEmbed(text);

    if (vector.length !== EXPECTED_EMBEDDING_DIMENSION) {
      throw new AiProviderError(
        `Embedding dimension mismatch: expected ${EXPECTED_EMBEDDING_DIMENSION}, got ${vector.length}.`
      );
    }

    return vector;
  } catch (err) {
    if (err instanceof AiProviderError) throw err;
    throw new AiProviderError();
  }
};
