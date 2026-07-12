// Typed errors mapped to HTTP status + API.md's error-code catalog by errorHandler.js.
export class AppError extends Error {
  constructor(message, statusCode, code, fieldErrors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export class ValidationError extends AppError {
  constructor(fieldErrors = [], message = "Validation failed.") {
    super(message, 400, "VALIDATION_ERROR", fieldErrors);
  }
}

export class AuthError extends AppError {
  constructor(message = "Invalid credentials.", code = "AUTH_INVALID_CREDENTIALS") {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You are not allowed to perform this action.", code = "FORBIDDEN_ROLE") {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message, code) {
    super(message, 409, code);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMITED");
  }
}
