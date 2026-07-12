import { useAnonymousSubmission } from "../hooks/useAnonymousSubmission.js";
import { ComplaintForm } from "../components/complaints/ComplaintForm.jsx";
import { ComplaintConfirmation } from "../components/complaints/ComplaintConfirmation.jsx";
import { Card } from "../components/ui/Card.jsx";

export const ComplaintFormPage = () => {
  const { status, errorMessage, submit, reset } = useAnonymousSubmission();

  if (status === "success") {
    return <ComplaintConfirmation onNewComplaint={reset} />;
  }

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">File an Anonymous Complaint</h1>
      <p className="mb-6 text-sm text-slate-500">
        Your complaint is submitted with no data that could identify you.
      </p>
      <ComplaintForm
        onSubmit={submit}
        isSubmitting={status === "submitting"}
        errorMessage={status === "error" ? errorMessage : null}
      />
    </Card>
  );
};
