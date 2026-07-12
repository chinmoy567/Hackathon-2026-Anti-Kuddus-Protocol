import { useState } from "react";
import { useIssueAnonymousTokenMutation, useSubmitLedgerEntryMutation } from "../store/apiSlice.js";

// Orchestrates token-issue -> ledger-entry-submit as one user-facing action,
// mirroring useAnonymousSubmission.js's shape for Mission 1 complaints. The
// anonymous token lives only in this hook's closure — never Redux, never
// RTK Query cache.
export const useLedgerSubmission = () => {
  const [issueToken] = useIssueAnonymousTokenMutation();
  const [submitEntry] = useSubmitLedgerEntryMutation();

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  const attempt = async ({ type, foodItemId, quantity }) => {
    const { token } = await issueToken("ledger_entry").unwrap();
    await submitEntry({ type, foodItemId, quantity, anonymousToken: token }).unwrap();
  };

  const submit = async ({ type, foodItemId, quantity }) => {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      await attempt({ type, foodItemId, quantity });
      setStatus("success");
    } catch (err) {
      // Token expired/replayed mid-flow (~30 min TTL) — one silent retry with a
      // freshly issued token before surfacing an error to the student.
      if (err?.status === 401 || err?.status === 409) {
        try {
          await attempt({ type, foodItemId, quantity });
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
