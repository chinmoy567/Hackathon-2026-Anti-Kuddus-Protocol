import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card } from "../components/ui/Card.jsx";
import { TextInput } from "../components/ui/TextInput.jsx";
import { Checkbox } from "../components/ui/Checkbox.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { usePostSeatStudentBatchMutation, useGetSeatStudentBatchQuery } from "../store/apiSlice.js";

const EMPTY_ROW = { rollNumber: "", name: "", heightCm: "", hasAccessibilityPriority: false };

// Teacher-only roster input for Mission 2 (task1-student-records.md §5).
// Client-side checks mirror the server so the offending row is pinpointed
// before a round trip, but the server remains the source of truth.
export const StudentRosterPage = () => {
  const { push } = useToast();
  const [postBatch, { isLoading: isSubmitting }] = usePostSeatStudentBatchMutation();
  const [submittedBatchId, setSubmittedBatchId] = useState(null);
  const { data } = useGetSeatStudentBatchQuery(submittedBatchId, { skip: !submittedBatchId });

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { batchId: "", students: [EMPTY_ROW] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "students" });
  const students = watch("students");
  const [kuddusIndex, setKuddusIndex] = useState(null);

  const clientErrors = [];
  const rolls = students.map((s) => s.rollNumber?.trim()).filter(Boolean);
  if (new Set(rolls).size !== rolls.length) {
    clientErrors.push("Roll numbers must be unique within the batch.");
  }
  if (kuddusIndex === null || kuddusIndex >= students.length) {
    clientErrors.push("Select exactly one student as Kuddus.");
  }

  const submitHandler = handleSubmit(async (form) => {
    if (clientErrors.length > 0) return;

    const payload = {
      batchId: form.batchId,
      students: form.students.map((s, i) => ({
        rollNumber: s.rollNumber,
        name: s.name,
        heightCm: Number(s.heightCm),
        hasAccessibilityPriority: Boolean(s.hasAccessibilityPriority),
        isKuddus: i === kuddusIndex,
      })),
    };

    try {
      const result = await postBatch(payload).unwrap();
      push(`Roster saved: ${result.count} students in batch "${result.batchId}".`, "success");
      setSubmittedBatchId(result.batchId);
    } catch (err) {
      push(err.message || "Failed to save roster.", "error");
    }
  });

  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">Student Roster</h1>
      <p className="mb-6 text-sm text-slate-500">
        Enter Name, Roll Number, and Height for each student, then mark accessibility priority and
        exactly one student as Kuddus.
      </p>

      <form onSubmit={submitHandler} noValidate className="space-y-6">
        <TextInput
          id="batchId"
          label="Batch ID"
          placeholder="e.g. class-9a-2026"
          error={errors.batchId?.message}
          {...register("batchId", { required: "Batch ID is required." })}
        />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-12 sm:items-end">
              <TextInput
                id={`students.${index}.rollNumber`}
                label="Roll"
                className="sm:col-span-2"
                error={errors.students?.[index]?.rollNumber?.message}
                {...register(`students.${index}.rollNumber`, { required: "Required." })}
              />
              <TextInput
                id={`students.${index}.name`}
                label="Name"
                className="sm:col-span-4"
                error={errors.students?.[index]?.name?.message}
                {...register(`students.${index}.name`, { required: "Required." })}
              />
              <TextInput
                id={`students.${index}.heightCm`}
                label="Height (cm)"
                type="number"
                min="1"
                className="sm:col-span-2"
                error={errors.students?.[index]?.heightCm?.message}
                {...register(`students.${index}.heightCm`, {
                  required: "Required.",
                  min: { value: 1, message: "Must be > 0." },
                })}
              />
              <Checkbox
                id={`students.${index}.hasAccessibilityPriority`}
                label="Accessibility priority"
                className="sm:col-span-2"
                {...register(`students.${index}.hasAccessibilityPriority`)}
              />
              <Checkbox
                id={`students.${index}.isKuddus`}
                label="Kuddus"
                role="radio"
                aria-checked={kuddusIndex === index}
                checked={kuddusIndex === index}
                onChange={() => setKuddusIndex(index)}
                className="sm:col-span-1"
              />
              <Button
                type="button"
                variant="secondary"
                className="sm:col-span-1"
                disabled={fields.length === 1}
                onClick={() => {
                  remove(index);
                  if (kuddusIndex === index) setKuddusIndex(null);
                  else if (kuddusIndex !== null && kuddusIndex > index) setKuddusIndex(kuddusIndex - 1);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="secondary" onClick={() => append(EMPTY_ROW)}>
          Add row
        </Button>

        {clientErrors.length > 0 && (
          <ul role="alert" className="space-y-1 text-sm text-rose-600">
            {clientErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}

        <Button type="submit" loading={isSubmitting} disabled={clientErrors.length > 0} className="w-full">
          {isSubmitting ? "Saving…" : "Save Roster"}
        </Button>
      </form>

      {data?.students && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="mb-3 text-sm font-medium text-slate-700">Saved roster ({data.students.length})</h2>
          <ul className="space-y-1 text-sm text-slate-600">
            {data.students.map((s) => (
              <li key={s._id}>
                #{s.rollNumber} — {s.name} — {s.heightCm}cm
                {s.hasAccessibilityPriority ? " · accessibility priority" : ""}
                {s.isKuddus ? " · Kuddus" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
