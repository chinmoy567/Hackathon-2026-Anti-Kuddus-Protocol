import { useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { TextInput } from "../components/ui/TextInput.jsx";
import { RuleCard } from "../components/factcheck/RuleCard.jsx";
import { ValidationCard } from "../components/factcheck/ValidationCard.jsx";
import { useSearchRulesMutation, useVerifyClaimMutation } from "../store/apiSlice.js";
import { FACT_CHECK_QUERY_MAX_LENGTH } from "../utils/constants.js";

// task1 spec §5 (baseline search) + task2 spec §5 (advanced "Verify with AI" validation card) —
// both actions share the same claim text box, triggered independently.
export const FactCheckPage = () => {
  const [claim, setClaim] = useState("");
  const [search, { data, isLoading, isError, error }] = useSearchRulesMutation();
  const [verify, { data: verifyData, isLoading: isVerifying, isError: isVerifyError, error: verifyError }] =
    useVerifyClaimMutation();

  const isOverLimit = claim.length > FACT_CHECK_QUERY_MAX_LENGTH;
  const isEmpty = claim.trim().length === 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmpty || isOverLimit) return;
    search(claim);
  };

  const handleVerify = () => {
    if (isEmpty || isOverLimit) return;
    verify(claim);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">Kuddus Fact-Checker</h1>
      <p className="mb-6 text-sm text-slate-500">
        Type a claim Kuddus made and search the official rulebook for matching rules.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          id="claim"
          label="Kuddus's claim"
          value={claim}
          maxLength={FACT_CHECK_QUERY_MAX_LENGTH}
          onChange={(event) => setClaim(event.target.value)}
          placeholder="e.g. The Headmaster said 1st Captains don't have to do homework"
          error={isOverLimit ? "Claim is too long." : null}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={isEmpty || isOverLimit} loading={isLoading}>
            Search Rulebook
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleVerify}
            disabled={isEmpty || isOverLimit}
            loading={isVerifying}
          >
            Verify with AI
          </Button>
        </div>

        {isError && (
          <p className="text-sm text-rose-600">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        )}
        {isVerifyError && (
          <p className="text-sm text-rose-600">
            {verifyError?.message || "Something went wrong. Please try again."}
          </p>
        )}
      </form>

      {verifyData && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="mb-3 text-sm font-medium text-slate-700">Validation Card</h2>
          <ValidationCard
            verdict={verifyData.verdict}
            confidence={verifyData.confidence}
            quote={verifyData.quote}
            ruleTitle={verifyData.ruleTitle}
          />
        </div>
      )}

      {data?.matches && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="mb-3 text-sm font-medium text-slate-700">Matching Rules</h2>
          {data.matches.length === 0 ? (
            <p className="text-sm text-slate-500">No matching rules found.</p>
          ) : (
            <div className="space-y-2">
              {data.matches.map((rule) => (
                <RuleCard key={rule.ruleId} title={rule.title} text={rule.text} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
