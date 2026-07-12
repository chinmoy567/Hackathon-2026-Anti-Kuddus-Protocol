import { AppError } from "../utils/errors.js";
import { error } from "../utils/apiResponse.js";

// Single formatter for claude.md's error envelope. Unknown errors are logged
// server-side with full detail but never leak internals to the client.
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const errors =
      err.fieldErrors && err.fieldErrors.length > 0
        ? err.fieldErrors
        : [{ code: err.code, message: err.message }];
    return error(res, { statusCode: err.statusCode, message: err.message, errors });
  }

  console.error("Unhandled error:", err);
  return error(res, {
    statusCode: 500,
    message: "Something went wrong.",
    errors: [{ code: "INTERNAL_ERROR", message: "An unexpected error occurred." }],
  });
};
