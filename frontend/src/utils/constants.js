// Mirrors API.md §14 exactly — no drift between the API contract and the UI.
export const CATEGORY_OPTIONS = [
  { value: "tiffin_theft", label: "Tiffin Theft" },
  { value: "bribes", label: "Bribes" },
  { value: "syllabus_bloat", label: "Syllabus Bloat" },
  { value: "other", label: "Other" },
];

export const DESCRIPTION_MAX_LENGTH = 2000;

export const MAX_EVIDENCE_SIZE_MB = 5;
export const ALLOWED_EVIDENCE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const STRIKE_LIMIT = 3;

export const COMPLAINT_STATUS_LABELS = {
  pending: "Pending Review",
  validated: "Validated",
  rejected: "Rejected",
};

// Mirrors API.md §11 exactly — the five hardcoded SOS locations, nothing else.
export const SOS_LOCATIONS = ["Library", "Playground", "Corridor", "Classroom", "Canteen"];

