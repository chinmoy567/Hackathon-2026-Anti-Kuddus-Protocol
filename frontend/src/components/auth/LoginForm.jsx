import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { TextInput } from "../ui/TextInput.jsx";
import { Button } from "../ui/Button.jsx";

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoggingIn } = useAuth();
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // Server always returns one generic message on failure — never a
  // field-specific hint (no user enumeration, API.md §2/§15).
  const onSubmit = async ({ rollNumber, pin }) => {
    setFormError(null);
    try {
      await login(rollNumber, pin);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err?.message || "Invalid roll number or PIN.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <TextInput
        id="rollNumber"
        label="Roll Number"
        placeholder="e.g. STU01"
        autoComplete="username"
        error={errors.rollNumber?.message}
        {...register("rollNumber", { required: "Roll number is required." })}
      />
      <TextInput
        id="pin"
        type="password"
        label="PIN"
        placeholder="••••"
        autoComplete="current-password"
        error={errors.pin?.message}
        {...register("pin", { required: "PIN is required." })}
      />
      {formError && (
        <p role="alert" className="text-sm text-rose-600">
          {formError}
        </p>
      )}
      <Button type="submit" loading={isLoggingIn} className="w-full">
        Log in
      </Button>
    </form>
  );
};
