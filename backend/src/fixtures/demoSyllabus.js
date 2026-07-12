// Canned "Kuddus syllabus" demo fixture — the mission's rehearsed, judge-facing demo path
// (Mission 3 README cross-cutting rule: "guaranteed to produce the correct keep/discard split
// even against the mock/cached fallback path"). Mixes real topics from BOTH seeded courses
// (CSE-301 Operating Systems, CSE-201 Data Structures & Algorithms — see curriculumCorpus.js)
// with the spec's own absurd non-examinable items, re-flavored as textbook front/back matter
// (publisher's foreword, author's biography, index, ISBN barcode) — the exact joke shape from
// `Hackathon Question.md`'s worked example ("the writer's biography," "the index," "the barcode
// on the back cover").
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

// Deterministic fallback for /syllabus/summarize when the AI Gateway's provider call fails and
// the input text matches DEMO_SYLLABUS_TEXT (syllabus.service.js's fallback branch).
export const DEMO_SUMMARIZE_FALLBACK_TOPICS = [
  "CPU Scheduling (FCFS, SJF, Round Robin)",
  "Process Synchronization (Semaphore, Mutex Lock)",
  "Memory Management (Contiguous Allocation, Paging, Segmentation)",
  "Stack (ADT, operations, infix-to-postfix conversion)",
  "Binary Search Trees (construction and deletion)",
  "Graph traversal (BFS, DFS)",
  "Publisher's foreword",
  "Author's biography",
  "Textbook index",
  "ISBN barcode on the back cover",
];

// Expected /syllabus/filter split for DEMO_SYLLABUS_TEXT — backs both the mandatory curated test
// suite (task2 spec §7) and the filter's fallback response on provider failure. courseCode and
// sourceRef values must match real curriculumCorpus.js entries.
export const DEMO_FILTER_EXPECTED_KEPT = [
  {
    topic: "CPU Scheduling (FCFS, SJF, Round Robin)",
    courseCode: "CSE-301",
    subject: "Operating Systems",
    sourceRef: "CSE-301 Final 2024, Q4",
  },
  {
    topic: "Process Synchronization (Semaphore, Mutex Lock)",
    courseCode: "CSE-301",
    subject: "Operating Systems",
    sourceRef: "CSE-301 Final 2024, Q6",
  },
  {
    topic: "Memory Management (Contiguous Allocation, Paging, Segmentation)",
    courseCode: "CSE-301",
    subject: "Operating Systems",
    sourceRef: "CSE-301 Final 2024, Q7",
  },
  {
    topic: "Stack (ADT, operations, infix-to-postfix conversion)",
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    sourceRef: "CSE-201 Final 2024, Q4",
  },
  {
    topic: "Binary Search Trees (construction and deletion)",
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    sourceRef: "CSE-201 Final Fall 2025, Q6",
  },
  {
    topic: "Graph traversal (BFS, DFS)",
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    sourceRef: "CSE-201 Final 2024, Q7",
  },
];

export const DEMO_FILTER_EXPECTED_DISCARDED = [
  { topic: "Publisher's foreword", reason: "not found in curriculum" },
  { topic: "Author's biography", reason: "not found in curriculum" },
  { topic: "Textbook index", reason: "not found in curriculum" },
  { topic: "ISBN barcode on the back cover", reason: "not found in curriculum" },
];
