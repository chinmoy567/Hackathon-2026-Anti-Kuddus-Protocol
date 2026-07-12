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

// Mirrors API.md §10 — quantity bound for a single food ledger entry.
export const LEDGER_FOOD_QUANTITY_MAX = 20;

// Mirrors API.md §9 — cost-control cap on pasted syllabus text.
export const SYLLABUS_TEXT_MAX_LENGTH = 5000;

// Frontend-side copy of the canned demo syllabus, for the "Try Kuddus's example" button.
// Mirrors backend/src/fixtures/demoSyllabus.js#DEMO_SYLLABUS_TEXT in content but does not need
// to be byte-identical — this is a UX convenience, not the tested contract (task1 plan §5).
export const DEMO_SYLLABUS_TEXT = `Attention Section B. For the upcoming Class Test, Kuddus (1st Captain) has
"generously" expanded the syllabus across BOTH Operating Systems and Data Structures. You are
responsible for EVERYTHING below, no exceptions:

1. CPU Scheduling — FCFS, SJF, and Round Robin, with full comparisons and scheduling criteria.
2. Process Synchronization — Semaphore and Mutex Lock, with worked examples.
3. Memory Management — Contiguous Allocation, Paging, and Segmentation.
4. Stack — the ADT, its basic operations, and infix-to-postfix conversion.
5. Binary Search Trees — construction and deletion of nodes.
6. Graph traversal — Breadth First Search (BFS) and Depth First Search (DFS).
7. Also, the publisher's foreword at the front of the textbook (page ii, very important apparently).
8. The full biography of the textbook's author, including his childhood and hobbies.
9. The alphabetical index at the very back of the textbook — yes, all of it.
10. The ISBN barcode printed on the back cover — Kuddus insists this "might be on the test."

No excuses. Kuddus says if you don't memorize the barcode he will personally confiscate your tiffin.`;

// Mirrors API.md §12 — cost-control cap on a fact-check search query.
export const FACT_CHECK_QUERY_MAX_LENGTH = 300;

