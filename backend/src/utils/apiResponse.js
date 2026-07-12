// Response envelope helpers — every endpoint uses these, per claude.md API Rules.

export const success = (res, { statusCode = 200, message = "Request completed successfully.", data = {} } = {}) =>
  res.status(statusCode).json({ success: true, message, data });

export const error = (res, { statusCode = 500, message = "Something went wrong.", errors = [] } = {}) =>
  res.status(statusCode).json({ success: false, message, errors });
