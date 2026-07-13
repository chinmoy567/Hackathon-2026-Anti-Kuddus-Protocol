import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookMarked, ShieldQuestion } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { staggerParent, staggerItem } from "../utils/motion.js";
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
    <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
      <PageHeader
        icon={Search}
        eyebrow="Fact-Checker"
        title="Kuddus Fact-Checker"
        description="Type a claim Kuddus made and search the official rulebook for matching rules."
      />
      <Card>
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
            <Search className="h-4 w-4" aria-hidden="true" />
            Search Rulebook
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleVerify}
            disabled={isEmpty || isOverLimit}
            loading={isVerifying}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
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

      <AnimatePresence>
        {verifyData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 border-t border-slate-200 pt-6"
          >
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ShieldQuestion className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Validation Card
            </h2>
            <ValidationCard
              verdict={verifyData.verdict}
              confidence={verifyData.confidence}
              quote={verifyData.quote}
              ruleTitle={verifyData.ruleTitle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data?.matches && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 border-t border-slate-200 pt-6"
          >
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <BookMarked className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Matching Rules
            </h2>
            {data.matches.length === 0 ? (
              <p className="text-sm text-slate-500">No matching rules found.</p>
            ) : (
              <motion.div className="space-y-2" initial="hidden" animate="visible" variants={staggerParent}>
                {data.matches.map((rule) => (
                  <motion.div key={rule.ruleId} variants={staggerItem}>
                    <RuleCard title={rule.title} text={rule.text} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </Card>
    </div>
  );
};
