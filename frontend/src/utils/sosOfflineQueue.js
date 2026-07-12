// Durable client-side SOS queue (Mission 5 Task 3 — Simulated Network
// Resilience). localStorage, not IndexedDB — the payload is a handful of
// small JSON objects, no query needs beyond "read the whole array."
// Pure functions, no React dependency — testable in isolation.
const STORAGE_KEY = "antikuddus_sos_offline_queue";

export const getQueue = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

// occurredAt and clientEventId are captured at enqueue time (button-press
// time), never regenerated at sync time — preserves "when it happened," not
// "when it synced" (database.md §6.4).
export const enqueue = ({ location, occurredAt, clientEventId }) => {
  const queue = getQueue();
  queue.push({ location, occurredAt, clientEventId });
  saveQueue(queue);
};

export const removeFromQueue = (clientEventId) => {
  const queue = getQueue().filter((entry) => entry.clientEventId !== clientEventId);
  saveQueue(queue);
};
