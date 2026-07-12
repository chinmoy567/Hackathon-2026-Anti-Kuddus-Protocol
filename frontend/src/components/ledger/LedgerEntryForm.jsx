import { useForm } from "react-hook-form";
import { Select } from "../ui/Select.jsx";
import { TextInput } from "../ui/TextInput.jsx";
import { Button } from "../ui/Button.jsx";
import { useGetFoodCatalogQuery } from "../../store/apiSlice.js";
import { LEDGER_FOOD_QUANTITY_MAX } from "../../utils/constants.js";

const ENTRY_TYPES = [
  { value: "cash", label: "Washroom Toll (fixed 2 Taka)" },
  { value: "food", label: "Tiffin Theft" },
];

// Two entry modes in one form — the fixed cash amount is a UI hint only and
// is never sent to the server, which always computes it itself (API.md API-4).
export const LedgerEntryForm = ({ onSubmit, isSubmitting, errorMessage }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { entryType: "cash", quantity: 1 },
  });
  const { data: foodCatalog } = useGetFoodCatalogQuery();
  const watchedType = watch("entryType");

  const foodOptions = (foodCatalog?.items || []).map((item) => ({
    value: item.id,
    label: `${item.name} (${item.caloriesPerUnit} cal/${item.unitLabel})`,
  }));

  const submitHandler = handleSubmit(async (data) => {
    if (data.entryType === "cash") {
      await onSubmit({ type: "cash" });
    } else {
      await onSubmit({ type: "food", foodItemId: data.foodItemId, quantity: Number(data.quantity) });
    }
  });

  return (
    <form onSubmit={submitHandler} noValidate className="space-y-5">
      <Select
        id="entryType"
        label="What happened?"
        options={ENTRY_TYPES}
        {...register("entryType")}
      />

      {watchedType === "food" && (
        <>
          <Select
            id="foodItemId"
            label="Food item"
            placeholder="Select the stolen item"
            options={foodOptions}
            error={errors.foodItemId?.message}
            {...register("foodItemId", { required: "Please select a food item." })}
          />
          <TextInput
            id="quantity"
            label="Quantity"
            type="number"
            min={1}
            max={LEDGER_FOOD_QUANTITY_MAX}
            error={errors.quantity?.message}
            {...register("quantity", {
              required: "Quantity is required.",
              min: { value: 1, message: "Quantity must be at least 1." },
              max: { value: LEDGER_FOOD_QUANTITY_MAX, message: `Quantity cannot exceed ${LEDGER_FOOD_QUANTITY_MAX}.` },
            })}
          />
        </>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-rose-600">
          {errorMessage}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? "Logging…" : "Log Entry"}
      </Button>
    </form>
  );
};
