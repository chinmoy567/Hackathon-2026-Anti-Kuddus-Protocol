import { useState } from "react";
import {
  useIssueAnonymousTokenMutation,
  useUploadEvidenceMutation,
  useSubmitComplaintMutation,
} from "../store/apiSlice.js";

// Orchestrates token-issue -> evidence-upload -> complaint-submit as one
// user-facing action (Frontend.md §5.2). The anonymous token and any
// evidenceFileIds live only in this hook's closure — never Redux, never
// RTK Query cache — and are discarded the instant the flow ends.
export const useAnonymousSubmission = () => {
  const [issueToken] = useIssueAnonymousTokenMutation();
  const [uploadEvidence] = useUploadEvidenceMutation();
  const [submitComplaint] = useSubmitComplaintMutation();

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  const attempt = async ({ category, description, files }) => {
    const { token } = await issueToken("complaint").unwrap();

    const evidenceFileIds = [];
    for (const file of files) {
      const { evidenceFileId } = await uploadEvidence({ file, anonymousToken: token }).unwrap();
      evidenceFileIds.push(evidenceFileId);
    }

    await submitComplaint({ category, description, evidenceFileIds, anonymousToken: token }).unwrap();
  };

  const submit = async ({ category, description, files = [] }) => {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await attempt({ category, description, files });
      setStatus("success");
    } catch (err) {
      // Token expired/replayed mid-flow (~30 min TTL) — one silent retry with a
      // freshly issued token before surfacing an error to the student.
      if (err?.status === 401 || err?.status === 409) {
        try {
          await attempt({ category, description, files });
          setStatus("success");
          return;
        } catch (retryErr) {
          setStatus("error");
          setErrorMessage(retryErr?.message || "Something went wrong. Please try again.");
          return;
        }
      }
      setStatus("error");
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage(null);
  };

  return { status, errorMessage, submit, reset };
};
