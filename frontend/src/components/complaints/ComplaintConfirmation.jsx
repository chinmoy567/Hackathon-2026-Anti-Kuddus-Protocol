import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

// Deliberately shows no complaint ID and no "view status" link — nothing
// linkable is ever returned (API.md §5 API-3). Focus moves here on mount so
// keyboard/screen-reader users aren't stranded on a form that just disappeared.
export const ComplaintConfirmation = ({ onNewComplaint }) => {
  const headingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Card className="mx-auto max-w-xl text-center">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold tracking-tight text-emerald-700 outline-none"
      >
        Complaint Submitted
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Your complaint has been submitted anonymously. Nothing that could identify you was recorded.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button onClick={onNewComplaint}>File Another</Button>
      </div>
    </Card>
  );
};
