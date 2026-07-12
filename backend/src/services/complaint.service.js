import { Complaint } from "../models/anonymous/complaint.model.js";
import { EvidenceFile } from "../models/anonymous/evidenceFile.model.js";
import { AnonymousToken } from "../models/anonymous/anonymousToken.model.js";
import { coarsenToDate } from "../utils/dateBucket.js";
import { ValidationError, NotFoundError, ConflictError } from "../utils/errors.js";
import { incrementStrike } from "./strike.service.js";

// Creates the complaint, links pre-uploaded evidence, and consumes the
// anonymous token — all in one logical step. Returns nothing linkable
// (API.md §5 API-3: "confirmation only").
export const createComplaint = async ({ category, description, evidenceFileIds = [] }, anonymousTokenCtx) => {
  if (evidenceFileIds.length > 0) {
    const validFiles = await EvidenceFile.find({
      _id: { $in: evidenceFileIds },
      sanitized: true,
      complaintId: null,
    });
    if (validFiles.length !== evidenceFileIds.length) {
      throw new ValidationError([
        { field: "evidenceFileIds", code: "VALIDATION_ERROR", message: "One or more evidence files are invalid or already linked." },
      ]);
    }
  }

  const complaint = await Complaint.create({
    category,
    description,
    evidenceFileIds,
    submittedAtBucket: coarsenToDate(),
    tokenHash: anonymousTokenCtx.tokenHash,
  });

  if (evidenceFileIds.length > 0) {
    await EvidenceFile.updateMany(
      { _id: { $in: evidenceFileIds } },
      { complaintId: complaint._id }
    );
  }

  anonymousTokenCtx.doc.used = true;
  anonymousTokenCtx.doc.usedAtBucket = coarsenToDate();
  await anonymousTokenCtx.doc.save();
};

// tokenHash is never selected — it must never be serialized in any response
// (API.md §5).
export const listComplaints = async ({ status, category, page = 1, limit = 20 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .select("-tokenHash")
      .populate("evidenceFileIds", "cloudinaryUrl mimeType sizeBytes")
      .sort({ submittedAtBucket: -1 })
      .skip(skip)
      .limit(limit),
    Complaint.countDocuments(filter),
  ]);

  return { items, page, totalPages: Math.max(Math.ceil(total / limit), 1) };
};

export const adjudicateComplaint = async (complaintId, status, adjudicatorRole) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new NotFoundError("Complaint not found.");
  if (complaint.status !== "pending") {
    throw new ConflictError("This complaint has already been adjudicated.", "COMPLAINT_ALREADY_ADJUDICATED");
  }

  complaint.status = status;
  if (status === "validated") {
    complaint.countedAsStrike = true;
    complaint.validatedByRole = adjudicatorRole;
    complaint.validatedAtBucket = coarsenToDate();
  }
  await complaint.save();

  if (status === "validated") {
    await incrementStrike();
  }

  return { status: complaint.status };
};
