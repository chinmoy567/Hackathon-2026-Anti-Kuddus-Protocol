// Curriculum seed corpus for Mission 3's RAG filter — sourced from real, provided course
// materials (not invented), spanning two courses:
//   CSE-301 Operating Systems      — `Operating System/Operating Systems Syllabus.md` (10 modules)
//                                     cross-referenced against the one real past exam on file:
//                                     `Operating System/Operating Systems (CSE-301)_2024.md`.
//   CSE-201 Data Structures & Algorithms — `Datastructures and Algorithms/Data Structures SYLLABUS.md`
//                                     (10 modules) cross-referenced against the two real past exams
//                                     on file: `..._2024.md` and `..._2025.md` (Fall 2025).
//
// `examFrequency` / `examsAvailable` are always stored together and must be read together — OS has
// only 1 real exam on file, DSA has 2, so a bare `examFrequency` count is not comparable across
// courses (see `.claude/task/mission_3/README.md` "Cross-course exam-frequency asymmetry").
// Consumed by seedCurriculum.js.
export const CURRICULUM_CORPUS = [
  // ===========================================================================================
  // CSE-301 — Operating Systems (examsAvailable: 1 — Operating Systems (CSE-301)_2024.md)
  // ===========================================================================================

  // Module 1 — Introduction to Operating Systems
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 1 — Introduction to Operating Systems",
    topicText: "Definition of an Operating System and its role as a resource manager.",
    sourceRef: "CSE-301 Syllabus, Module 1",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 1 — Introduction to Operating Systems",
    topicText: "Functions of an Operating System.",
    sourceRef: "CSE-301 Syllabus, Module 1",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 1 — Introduction to Operating Systems",
    topicText: "Types of Operating Systems — Batch, Multiprogramming, and Time-Sharing Operating Systems, compared.",
    sourceRef: "CSE-301 Final 2024, Q1",
    examFrequency: 1,
    examsAvailable: 1,
  },

  // Module 2 — Operating System Structure
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 2 — Operating System Structure",
    topicText: "System Calls — categories and practical examples.",
    sourceRef: "CSE-301 Syllabus, Module 2",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 2 — Operating System Structure",
    topicText: "Kernel Mode and User Mode execution.",
    sourceRef: "CSE-301 Syllabus, Module 2",
    examFrequency: 1,
    examsAvailable: 1,
  },

  // Module 3 — Process Management
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 3 — Process Management",
    topicText: "Process Control Block (PCB) and its major components.",
    sourceRef: "CSE-301 Final 2024, Q3",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 3 — Process Management",
    topicText: "Process Life Cycle and the Process State Transition Diagram.",
    sourceRef: "CSE-301 Syllabus, Module 3",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 3 — Process Management",
    topicText: "Context Switching between processes.",
    sourceRef: "CSE-301 Syllabus, Module 3",
    examFrequency: 0,
    examsAvailable: 1,
  },

  // Module 4 — CPU Scheduling
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 4 — CPU Scheduling",
    topicText: "FCFS, SJF, and Round Robin CPU Scheduling algorithms, compared.",
    sourceRef: "CSE-301 Final 2024, Q4",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 4 — CPU Scheduling",
    topicText: "Scheduling criteria: Turnaround Time, Waiting Time, and Response Time.",
    sourceRef: "CSE-301 Final 2024, Q4",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 4 — CPU Scheduling",
    topicText: "Priority Scheduling as a CPU scheduling algorithm.",
    sourceRef: "CSE-301 Syllabus, Module 4",
    examFrequency: 0,
    examsAvailable: 1,
  },

  // Module 5 — Threads
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 5 — Threads",
    topicText: "Multithreading and its advantages over single-threaded execution.",
    sourceRef: "CSE-301 Final 2024, Q5",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 5 — Threads",
    topicText: "User-Level Threads versus Kernel-Level Threads, and how a Process differs from a Thread.",
    sourceRef: "CSE-301 Final 2024, Q5",
    examFrequency: 1,
    examsAvailable: 1,
  },

  // Module 6 — Process Synchronization
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 6 — Process Synchronization",
    topicText: "Process Synchronization and why it is required.",
    sourceRef: "CSE-301 Final 2024, Q6",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 6 — Process Synchronization",
    topicText: "Semaphore and Mutex Lock, with worked examples.",
    sourceRef: "CSE-301 Final 2024, Q6",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 6 — Process Synchronization",
    topicText: "The Critical Section Problem in process synchronization.",
    sourceRef: "CSE-301 Syllabus, Module 6",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 6 — Process Synchronization",
    topicText: "Deadlock — introduction and the conditions under which it occurs.",
    sourceRef: "CSE-301 Syllabus, Module 6",
    examFrequency: 0,
    examsAvailable: 1,
  },

  // Module 7 — Memory Management
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 7 — Memory Management",
    topicText: "Contiguous Memory Allocation.",
    sourceRef: "CSE-301 Final 2024, Q7",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 7 — Memory Management",
    topicText: "Paging, and why it is preferred over Contiguous Memory Allocation.",
    sourceRef: "CSE-301 Final 2024, Q7",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 7 — Memory Management",
    topicText: "Segmentation, with a worked example.",
    sourceRef: "CSE-301 Final 2024, Q7",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 7 — Memory Management",
    topicText: "Virtual Memory — purpose and advantages.",
    sourceRef: "CSE-301 Syllabus, Module 7",
    examFrequency: 0,
    examsAvailable: 1,
  },

  // Module 8 — File Systems
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 8 — File Systems",
    topicText: "File Allocation Techniques.",
    sourceRef: "CSE-301 Final 2024, Q8",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 8 — File Systems",
    topicText: "Directory Structure — Single-Level Directory versus Tree-Structured Directory.",
    sourceRef: "CSE-301 Final 2024, Q8",
    examFrequency: 1,
    examsAvailable: 1,
  },

  // Module 9 — Disk Management
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 9 — Disk Management",
    topicText: "Disk Scheduling algorithms, including SSTF and SCAN, with worked examples.",
    sourceRef: "CSE-301 Final 2024, Q9",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 9 — Disk Management",
    topicText: "RAID levels and their advantages.",
    sourceRef: "CSE-301 Final 2024, Q9",
    examFrequency: 1,
    examsAvailable: 1,
  },

  // Module 10 — Protection & Security
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 10 — Protection & Security",
    topicText: "Authentication, Authorization, and Accounting (AAA) in Operating Systems.",
    sourceRef: "CSE-301 Final 2024, Q10",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 10 — Protection & Security",
    topicText: "Common Operating System security threats and their prevention methods.",
    sourceRef: "CSE-301 Final 2024, Q10",
    examFrequency: 1,
    examsAvailable: 1,
  },
  {
    courseCode: "CSE-301",
    subject: "Operating Systems",
    chapter: "Module 10 — Protection & Security",
    topicText: "Access Control mechanisms.",
    sourceRef: "CSE-301 Syllabus, Module 10",
    examFrequency: 0,
    examsAvailable: 1,
  },

  // ===========================================================================================
  // CSE-201 — Data Structures & Algorithms
  // (examsAvailable: 2 — Datastructures and Algorithms (CSE-201)_2024.md, Fall 2025)
  // ===========================================================================================

  // Module 1 — Introduction to Data Structures
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 1 — Introduction to Data Structures",
    topicText: "Definition of a Data Structure and why Data Structures are important in Computer Science.",
    sourceRef: "CSE-201 Final 2024, Q1",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 1 — Introduction to Data Structures",
    topicText: "Linear versus Non-Linear Data Structures, with suitable examples.",
    sourceRef: "CSE-201 Final 2024, Q1",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 1 — Introduction to Data Structures",
    topicText: "Abstract Data Type (ADT), and Static versus Dynamic Data Structures.",
    sourceRef: "CSE-201 Final Fall 2025, Q1",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 1 — Introduction to Data Structures",
    topicText: "Time Complexity and Big O notation, with example analyses.",
    sourceRef: "CSE-201 Final Fall 2025, Q2",
    examFrequency: 1,
    examsAvailable: 2,
  },

  // Module 2 — Arrays
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 2 — Arrays",
    topicText: "Memory representation of one-dimensional and two-dimensional arrays.",
    sourceRef: "CSE-201 Final 2024, Q2",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 2 — Arrays",
    topicText: "Array insertion and deletion algorithms, and the time complexity of common array operations.",
    sourceRef: "CSE-201 Final 2024, Q2",
    examFrequency: 2,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 2 — Arrays",
    topicText: "Array traversal.",
    sourceRef: "CSE-201 Syllabus, Module 2",
    examFrequency: 0,
    examsAvailable: 2,
  },

  // Module 3 — Linked Lists
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 3 — Linked Lists",
    topicText: "Singly Linked List structure, with insertion and deletion, compared against Arrays for memory usage and efficiency.",
    sourceRef: "CSE-201 Final 2024, Q3",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 3 — Linked Lists",
    topicText: "Doubly Linked List insertion and deletion.",
    sourceRef: "CSE-201 Final Fall 2025, Q3",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 3 — Linked Lists",
    topicText: "Circular Linked List and its advantages.",
    sourceRef: "CSE-201 Final Fall 2025, Q3",
    examFrequency: 1,
    examsAvailable: 2,
  },

  // Module 4 — Stacks
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 4 — Stacks",
    topicText: "Stack ADT and its basic operations — Push, Pop, and Peek.",
    sourceRef: "CSE-201 Final 2024, Q4",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 4 — Stacks",
    topicText: "Converting an infix expression to postfix notation using a Stack.",
    sourceRef: "CSE-201 Final 2024, Q4",
    examFrequency: 2,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 4 — Stacks",
    topicText: "Stack implementation using a Linked List, and applications of the Stack data structure.",
    sourceRef: "CSE-201 Final Fall 2025, Q4",
    examFrequency: 1,
    examsAvailable: 2,
  },

  // Module 5 — Queues
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 5 — Queues",
    topicText: "Circular Queue implementation, with suitable examples.",
    sourceRef: "CSE-201 Final Fall 2025, Q5",
    examFrequency: 2,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 5 — Queues",
    topicText: "Priority Queue and its real-life applications.",
    sourceRef: "CSE-201 Final Fall 2025, Q5",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 5 — Queues",
    topicText: "Linear Queue and its real-life applications.",
    sourceRef: "CSE-201 Syllabus, Module 5",
    examFrequency: 0,
    examsAvailable: 2,
  },

  // Module 6 — Trees
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 6 — Trees",
    topicText: "Binary Tree properties, compared against Binary Search Tree (BST).",
    sourceRef: "CSE-201 Final 2024, Q6",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 6 — Trees",
    topicText: "Constructing and deleting nodes from a Binary Search Tree (BST).",
    sourceRef: "CSE-201 Final Fall 2025, Q6",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 6 — Trees",
    topicText: "AVL Tree rotations, compared against plain Binary Search Trees.",
    sourceRef: "CSE-201 Final Fall 2025, Q7",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 6 — Trees",
    topicText: "Tree Traversals.",
    sourceRef: "CSE-201 Syllabus, Module 6",
    examFrequency: 0,
    examsAvailable: 2,
  },

  // Module 7 — Graphs
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 7 — Graphs",
    topicText: "Breadth First Search (BFS) graph traversal algorithm.",
    sourceRef: "CSE-201 Final 2024, Q7",
    examFrequency: 2,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 7 — Graphs",
    topicText: "Depth First Search (DFS) graph traversal algorithm, with an example.",
    sourceRef: "CSE-201 Final 2024, Q7",
    examFrequency: 2,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 7 — Graphs",
    topicText: "Graph representation.",
    sourceRef: "CSE-201 Syllabus, Module 7",
    examFrequency: 0,
    examsAvailable: 2,
  },

  // Module 8 — Searching
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 8 — Searching",
    topicText: "Linear Search and Binary Search algorithms, with a time-complexity comparison.",
    sourceRef: "CSE-201 Final 2024, Q8",
    examFrequency: 1,
    examsAvailable: 2,
  },

  // Module 9 — Sorting
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 9 — Sorting",
    topicText: "Selection Sort and Insertion Sort algorithms, compared against Bubble Sort.",
    sourceRef: "CSE-201 Final 2024, Q9",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 9 — Sorting",
    topicText: "Merge Sort and Quick Sort algorithms, compared.",
    sourceRef: "CSE-201 Final Fall 2025, Q9",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 9 — Sorting",
    topicText: "Heap Sort algorithm, with an example.",
    sourceRef: "CSE-201 Final Fall 2025, Q9",
    examFrequency: 1,
    examsAvailable: 2,
  },

  // Module 10 — Hashing
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 10 — Hashing",
    topicText: "Hash Tables, Hash Functions, and the characteristics of a good Hash Function.",
    sourceRef: "CSE-201 Final 2024, Q10",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 10 — Hashing",
    topicText: "Collision Resolution using Linear Probing and Chaining.",
    sourceRef: "CSE-201 Final 2024, Q10",
    examFrequency: 1,
    examsAvailable: 2,
  },
  {
    courseCode: "CSE-201",
    subject: "Data Structures and Algorithms",
    chapter: "Module 10 — Hashing",
    topicText: "Open Addressing and Double Hashing collision-resolution techniques.",
    sourceRef: "CSE-201 Final Fall 2025, Q10",
    examFrequency: 1,
    examsAvailable: 2,
  },
];
