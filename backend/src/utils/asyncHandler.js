// Wraps an async controller so a rejected promise reaches errorHandler
// instead of crashing the process.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
