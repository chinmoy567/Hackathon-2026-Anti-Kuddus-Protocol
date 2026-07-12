import { Student } from "../models/identity/student.model.js";
import { AnonymousToken } from "../models/anonymous/anonymousToken.model.js";
import { env } from "../config/env.js";
import { hashToken, generateRawToken } from "../utils/tokenHash.js";
import { coarsenToHour } from "../utils/dateBucket.js";
import { TooManyRequestsError } from "../utils/errors.js";

const ANONYMOUS_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes, per API.md §2

// Issuance-side throttle on the IDENTITY side, before the one-way cut to the
// Anonymous Store (database.md §10 checklist). This is the only place a
// student's identity and a to-be-anonymous submission are ever in the same
// document — the throttle counter, never the submission itself.
export const issueAnonymousToken = async (studentId, purpose) => {
  const student = await Student.findById(studentId);
  const { max, windowMs } = env.tokenIssuanceRateLimit;
  const now = Date.now();
  const windowStart = student.tokenIssuance?.windowStart?.getTime() ?? 0;

  if (now - windowStart > windowMs) {
    student.tokenIssuance.count = 0;
    student.tokenIssuance.windowStart = new Date(now);
  }

  if (student.tokenIssuance.count >= max) {
    throw new TooManyRequestsError("Too many token requests. Please wait before trying again.");
  }

  student.tokenIssuance.count += 1;
  await student.save();

  const rawToken = generateRawToken();
  const expiresAt = new Date(now + ANONYMOUS_TOKEN_TTL_MS);

  await AnonymousToken.create({
    tokenHash: hashToken(rawToken),
    purpose,
    issuedAtBucket: coarsenToHour(),
    expiresAt,
  });

  // Returned exactly once — never retrievable again (API.md §4).
  return { token: rawToken, expiresAt };
};
