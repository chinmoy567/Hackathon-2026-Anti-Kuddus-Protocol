import multer from "multer";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { v2 as cloudinary } from "cloudinary";
import { EvidenceFile } from "../models/anonymous/evidenceFile.model.js";
import { env } from "../config/env.js";
import { coarsenToDate } from "../utils/dateBucket.js";
import { AppError } from "../utils/errors.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const SHARP_FORMAT = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp" };

// Multer-level filter is a fast, cosmetic first pass on the declared Content-Type;
// the magic-byte check in process() below is what's actually trusted.
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Unsupported file type.", 400, "INVALID_FILE_TYPE"));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = multerUpload.single("image");

// Multer throws its own error class outside the normal Express error contract
// for limit violations — translate it before it reaches errorHandler.
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return next(new AppError("File exceeds the 5MB limit.", 400, "FILE_TOO_LARGE"));
  }
  next(err);
};

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "antikuddus/evidence", resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

// Architecture Decision D6: every uploaded image is fully re-encoded server-side;
// there is no code path that persists the original bytes.
export const processEvidence = async (fileBuffer) => {
  const detected = await fileTypeFromBuffer(fileBuffer);
  if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
    throw new AppError("File content does not match an allowed image type.", 400, "INVALID_FILE_TYPE");
  }

  // .rotate() bakes in the EXIF orientation visually BEFORE metadata is stripped —
  // otherwise a sideways photo would flip once its orientation tag is gone.
  // .withMetadata() is never called, so EXIF/GPS/camera data does not survive.
  const sanitizedBuffer = await sharp(fileBuffer)
    .rotate()
    .toFormat(SHARP_FORMAT[detected.mime])
    .toBuffer();

  const uploadResult = await uploadBufferToCloudinary(sanitizedBuffer);

  const evidenceFile = await EvidenceFile.create({
    cloudinaryPublicId: uploadResult.public_id,
    cloudinaryUrl: uploadResult.secure_url,
    mimeType: detected.mime,
    sizeBytes: sanitizedBuffer.length,
    sanitized: true,
    sanitizedAtBucket: coarsenToDate(),
  });

  return { evidenceFileId: evidenceFile._id };
};
