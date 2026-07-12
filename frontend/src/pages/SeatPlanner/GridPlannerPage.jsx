import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../../components/ui/Card.jsx";
import { TextInput } from "../../components/ui/TextInput.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { SeatGrid } from "../../components/SeatGrid/SeatGrid.jsx";
import { usePostSeatPlanMutation, useGetSeatStudentBatchQuery } from "../../store/apiSlice.js";

const ALGORITHM_OPTIONS = [
  { value: "height_sort", label: "Height Sort" },
  { value: "line_of_sight_optimized", label: "Line-of-Sight Optimized" },
];

const parseAisleColumns = (raw) =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number);

// Teacher-only baseline grid planner — generates an ascending-height seat
// plan for a batch (task2-baseline-grid-sorting.md §5).
export const GridPlannerPage = () => {
  const { push } = useToast();
  const [postPlan, { isLoading: isGenerating }] = usePostSeatPlanMutation();
  const [plan, setPlan] = useState(null);
  const [rosterBatchId, setRosterBatchId] = useState(null);

  const { data: roster } = useGetSeatStudentBatchQuery(rosterBatchId, { skip: !rosterBatchId });
  const studentLookup = useMemo(() => {
    const map = {};
    (roster?.students || []).forEach((s) => {
      map[s._id] = s;
    });
    return map;
  }, [roster]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      batchId: "",
      gridRows: 5,
      gridCols: 6,
      teacherRow: 0,
      teacherCol: 0,
      algorithm: "height_sort",
      aisleColumns: "",
    },
  });

  const gridRows = Number(watch("gridRows"));
  const gridCols = Number(watch("gridCols"));
  const teacherRow = Number(watch("teacherRow"));
  const teacherCol = Number(watch("teacherCol"));

  const clientErrors = [];
  if (Number.isFinite(teacherRow) && Number.isFinite(gridRows) && teacherRow >= gridRows) {
    clientErrors.push("Teacher row must be within the grid.");
  }
  if (Number.isFinite(teacherCol) && Number.isFinite(gridCols) && teacherCol >= gridCols) {
    clientErrors.push("Teacher column must be within the grid.");
  }

  const submitHandler = handleSubmit(async (form) => {
    if (clientErrors.length > 0) return;

    const aisleColumns = parseAisleColumns(form.aisleColumns);

    const payload = {
      batchId: form.batchId,
      gridRows: Number(form.gridRows),
      gridCols: Number(form.gridCols),
      teacherPosition: { row: Number(form.teacherRow), col: Number(form.teacherCol) },
      algorithm: form.algorithm,
      ...(aisleColumns.length > 0 ? { aisleColumns } : {}),
    };

    try {
      const result = await postPlan(payload).unwrap();
      setPlan(result);
      setRosterBatchId(form.batchId);
      push("Seat plan generated.", "success");
    } catch (err) {
      push(err.message || "Failed to generate seat plan.", "error");
    }
  });

  return (
    <Card className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900">Seat Grid Planner</h1>
      <p className="mb-6 text-sm text-slate-500">
        Configure the classroom grid and generate an ascending-height seating plan.
      </p>

      <form onSubmit={submitHandler} noValidate className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <TextInput
          id="batchId"
          label="Batch ID"
          className="col-span-2 sm:col-span-4"
          error={errors.batchId?.message}
          {...register("batchId", { required: "Batch ID is required." })}
        />
        <TextInput
          id="gridRows"
          label="Rows"
          type="number"
          min="1"
          error={errors.gridRows?.message}
          {...register("gridRows", { required: "Required.", min: { value: 1, message: "Must be > 0." } })}
        />
        <TextInput
          id="gridCols"
          label="Columns"
          type="number"
          min="1"
          error={errors.gridCols?.message}
          {...register("gridCols", { required: "Required.", min: { value: 1, message: "Must be > 0." } })}
        />
        <TextInput
          id="teacherRow"
          label="Teacher Row"
          type="number"
          min="0"
          error={errors.teacherRow?.message}
          {...register("teacherRow", { required: "Required.", min: { value: 0, message: "Must be >= 0." } })}
        />
        <TextInput
          id="teacherCol"
          label="Teacher Col"
          type="number"
          min="0"
          error={errors.teacherCol?.message}
          {...register("teacherCol", { required: "Required.", min: { value: 0, message: "Must be >= 0." } })}
        />
        <Select
          id="algorithm"
          label="Algorithm"
          options={ALGORITHM_OPTIONS}
          className="col-span-2"
          {...register("algorithm")}
        />
        <TextInput
          id="aisleColumns"
          label="Aisle columns (comma-separated)"
          placeholder="e.g. 2, 5"
          className="col-span-2"
          {...register("aisleColumns")}
        />

        {clientErrors.length > 0 && (
          <ul role="alert" className="col-span-2 space-y-1 text-sm text-rose-600 sm:col-span-4">
            {clientErrors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}

        <Button
          type="submit"
          loading={isGenerating}
          disabled={clientErrors.length > 0}
          className="col-span-2 sm:col-span-4"
        >
          {isGenerating ? "Generating…" : "Generate Seat Plan"}
        </Button>
      </form>

      {plan && plan.feasible === false && (
        <div role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Plan could not fully satisfy all constraints.</p>
          <p className="mt-1">{plan.infeasibilityReason}</p>
        </div>
      )}

      {plan && (
        <SeatGrid
          gridRows={plan.gridRows}
          gridCols={plan.gridCols}
          teacherPosition={plan.teacherPosition}
          assignments={plan.assignments}
          aisleColumns={plan.aisleColumns}
          studentLookup={studentLookup}
        />
      )}
    </Card>
  );
};
