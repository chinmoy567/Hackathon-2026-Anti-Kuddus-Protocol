import { AppError } from "../utils/errors.js";

// Multer has already applied the size limit + MIME filter by the time this runs
// (see services/evidenceProcessing.service.js upload config). This only catches
// the "no file attached at all" case.
export const ensureFilePresent = (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No image file was attached.", 400, "INVALID_FILE_TYPE"));
  }
  next();
};
