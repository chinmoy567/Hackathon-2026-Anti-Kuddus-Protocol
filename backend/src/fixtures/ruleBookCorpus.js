// Official School Rulebook (Version 1.0) — real, user-provided content
// (.claude/issues/ISSUES.md Issue 6 resolution). Replaces the placeholder corpus wholesale;
// consumed by seedRuleBook.js. One rule_book_entries doc per numbered rule, title/category/
// keywords derived from the rulebook's own section headers.
export const RULE_BOOK_CORPUS = [
  // ===== Academic Rules =====
  {
    title: "Rule 1 — Homework Applies to Everyone",
    text: "Every student, including class captains, must complete all assigned homework before the deadline.",
    category: "academic",
    keywords: ["homework", "deadline", "captain", "exemption"],
  },
  {
    title: "Rule 2 — No Unwritten Academic Exemptions for Captains",
    text: "Class captains do not receive academic exemptions unless approved in writing by the Headmaster.",
    category: "academic",
    keywords: ["captain", "exemption", "headmaster", "written approval"],
  },
  {
    title: "Rule 3 — Mandatory Class Test Attendance",
    text: "Students must attend all scheduled class tests unless officially excused.",
    category: "academic",
    keywords: ["class test", "attendance", "excused"],
  },
  {
    title: "Rule 4 — Syllabus-Only Examination Content",
    text: "Only topics listed in the officially approved syllabus may appear in examinations.",
    category: "academic",
    keywords: ["syllabus", "examination", "approved curriculum", "barcode"],
  },
  {
    title: "Rule 5 — Teachers Announce Exam Syllabi",
    text: "Teachers are responsible for announcing examination syllabi.",
    category: "academic",
    keywords: ["teacher", "syllabus", "examination", "announce"],
  },

  // ===== Captain Responsibilities =====
  {
    title: "Rule 6 — Captains Must Consult Before Major Decisions",
    text: "The First Captain must consult the Second Captain and Third Captain before making major class decisions.",
    category: "captain_conduct",
    keywords: ["captain", "consult", "decision", "veto"],
  },
  {
    title: "Rule 7 — Captains Represent All Students Fairly",
    text: "Class captains are expected to represent all students fairly.",
    category: "captain_conduct",
    keywords: ["captain", "fairness", "representation"],
  },
  {
    title: "Rule 8 — No Misuse of Captain Authority",
    text: "Captains may not misuse their authority for personal benefit.",
    category: "captain_conduct",
    keywords: ["captain", "authority", "misuse", "personal benefit"],
  },
  {
    title: "Rule 9 — Captains Follow the Same Rules as Everyone",
    text: "Captains must follow all school rules like every other student.",
    category: "captain_conduct",
    keywords: ["captain", "school rules", "equal treatment"],
  },
  {
    title: "Rule 10 — Removal for Repeated Abuse of Authority",
    text:
      "If a captain repeatedly abuses authority, the class teacher may remove them after " +
      "following school disciplinary procedures.",
    category: "captain_conduct",
    keywords: ["captain", "removal", "impeachment", "abuse of authority", "disciplinary procedure"],
  },

  // ===== Classroom Rules =====
  {
    title: "Rule 11 — Attentiveness During Class",
    text: "Students must remain attentive during class hours.",
    category: "classroom",
    keywords: ["attentive", "class hours"],
  },
  {
    title: "Rule 12 — No Sleeping in Class",
    text: "Sleeping during class is prohibited.",
    category: "classroom",
    keywords: ["sleeping", "class", "prohibited"],
  },
  {
    title: "Rule 13 — Approved Seating Arrangement",
    text: "Students must sit according to the seating arrangement approved by the class teacher.",
    category: "classroom",
    keywords: ["seating", "arrangement", "teacher approval"],
  },
  {
    title: "Rule 14 — Seating May Not Block the Teacher's View",
    text: "Seat arrangements must not intentionally block the teacher's view.",
    category: "classroom",
    keywords: ["seating", "line of sight", "teacher view", "tall students"],
  },

  // ===== Examination Rules =====
  {
    title: "Rule 15 — Teachers Set Examination Dates",
    text: "Teachers determine examination dates.",
    category: "examination",
    keywords: ["examination", "date", "teacher"],
  },
  {
    title: "Rule 16 — Captains Cannot Schedule Exams Unilaterally",
    text: "Class captains cannot schedule examinations without teacher approval.",
    category: "examination",
    keywords: ["captain", "examination", "schedule", "teacher approval"],
  },
  {
    title: "Rule 17 — Reasonable, Curriculum-Bound Test Syllabus",
    text: "The syllabus for a class test must remain reasonable and follow the approved curriculum.",
    category: "examination",
    keywords: ["syllabus", "class test", "reasonable", "curriculum"],
  },

  // ===== Student Welfare =====
  {
    title: "Rule 18 — No Unauthorized Money Collection",
    text:
      "No student may collect money from another student without written permission from the " +
      "school administration.",
    category: "student_welfare",
    keywords: ["money", "collection", "permission", "administration"],
  },
  {
    title: "Rule 19 — Free Washroom Access",
    text: "Washroom access cannot require any payment.",
    category: "student_welfare",
    keywords: ["washroom", "payment", "toll", "bribe", "taka"],
  },
  {
    title: "Rule 20 — No Confiscating Another Student's Food",
    text: "No student may confiscate or consume another student's food without permission.",
    category: "student_welfare",
    keywords: ["food", "confiscate", "tiffin", "consume", "permission"],
  },

  // ===== School Property =====
  {
    title: "Rule 21 — Respect for School and Personal Property",
    text: "Students must respect school property and the belongings of others.",
    category: "school_property",
    keywords: ["property", "respect", "belongings"],
  },
  {
    title: "Rule 22 — No Stealing or Damaging Property",
    text: "Stealing or damaging another student's property is prohibited.",
    category: "school_property",
    keywords: ["stealing", "damage", "property", "prohibited"],
  },

  // ===== Discipline =====
  {
    title: "Rule 23 — No Bullying, Intimidation, or Harassment",
    text: "Bullying, intimidation, and harassment are prohibited.",
    category: "discipline",
    keywords: ["bullying", "intimidation", "harassment"],
  },
  {
    title: "Rule 24 — False Claims of Official Policy Are Misconduct",
    text: "False statements presented as official school policy are considered misconduct.",
    category: "discipline",
    keywords: ["false statement", "official policy", "misconduct", "headmaster said"],
  },
  {
    title: "Rule 25 — Anonymous Misconduct Reporting",
    text: "Students may anonymously report misconduct through approved school procedures.",
    category: "discipline",
    keywords: ["anonymous", "report", "misconduct", "procedure"],
  },
];
