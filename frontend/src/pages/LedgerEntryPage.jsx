import { useLedgerSubmission } from "../hooks/useLedgerSubmission.js";
import { LedgerEntryForm } from "../components/ledger/LedgerEntryForm.jsx";
import { LedgerEntryConfirmation } from "../components/ledger/LedgerEntryConfirmation.jsx";
import { Card } from "../components/ui/Card.jsx";

export const LedgerEntryPage = () => {
  const { status, errorMessage, submit, reset } = useLedgerSubmission();

  if (status === "success") {
    return <LedgerEntryConfirmation onNewEntry={reset} />;
  }

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">Log a Ledger Entry</h1>
      <p className="mb-6 text-sm text-slate-500">
        Log a washroom toll or stolen tiffin item. Your entry is submitted with no data that could identify you.
      </p>
      <LedgerEntryForm
        onSubmit={submit}
        isSubmitting={status === "submitting"}
        errorMessage={status === "error" ? errorMessage : null}
      />
    </Card>
  );
};
