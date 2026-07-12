import { useState } from "react";
import { useForm } from "react-hook-form";
import { Select } from "../ui/Select.jsx";
import { TextArea } from "../ui/TextArea.jsx";
import { Button } from "../ui/Button.jsx";
import { EvidenceDropzone } from "./EvidenceDropzone.jsx";
import { CATEGORY_OPTIONS, DESCRIPTION_MAX_LENGTH } from "../../utils/constants.js";

// The multi-step token -> evidence -> complaint choreography (owned by the
// parent page's useAnonymousSubmission hook) is presented here as one
// "Submitting…" action — the submitter never sees the intermediate steps.
export const ComplaintForm = ({ onSubmit, isSubmitting, errorMessage }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [files, setFiles] = useState([]);
  const description = watch("description", "") || "";

  const submitHandler = handleSubmit(async (data) => {
    await onSubmit({ category: data.category, description: data.description, files });
  });

  return (
    <form onSubmit={submitHandler} noValidate className="space-y-5">
      <Select
        id="category"
        label="Category"
        placeholder="Select a category"
        options={CATEGORY_OPTIONS}
        error={errors.category?.message}
        {...register("category", { required: "Please select a category." })}
      />
      <TextArea
        id="description"
        label="Description"
        placeholder="Describe what happened..."
        maxLength={DESCRIPTION_MAX_LENGTH}
        currentLength={description.length}
        error={errors.description?.message}
        {...register("description", {
          required: "Please describe what happened.",
          maxLength: { value: DESCRIPTION_MAX_LENGTH, message: `Must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.` },
        })}
      />
      <EvidenceDropzone files={files} onChange={setFiles} disabled={isSubmitting} />
      {errorMessage && (
        <p role="alert" className="text-sm text-rose-600">
          {errorMessage}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting…" : "Submit Complaint"}
      </Button>
    </form>
  );
};
