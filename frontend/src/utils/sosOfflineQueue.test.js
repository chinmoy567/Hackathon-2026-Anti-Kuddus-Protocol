import { describe, it, expect, beforeEach } from "vitest";
import { getQueue, enqueue, removeFromQueue } from "./sosOfflineQueue.js";

describe("sosOfflineQueue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty array when nothing is queued", () => {
    expect(getQueue()).toEqual([]);
  });

  it("enqueue appends an entry and getQueue reflects it", () => {
    enqueue({ location: "Library", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-1" });

    expect(getQueue()).toEqual([
      { location: "Library", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-1" },
    ]);
  });

  it("multiple enqueues accumulate in order", () => {
    enqueue({ location: "Library", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-1" });
    enqueue({ location: "Canteen", occurredAt: "2026-07-12T10:05:00.000Z", clientEventId: "evt-2" });

    const queue = getQueue();
    expect(queue).toHaveLength(2);
    expect(queue[0].clientEventId).toBe("evt-1");
    expect(queue[1].clientEventId).toBe("evt-2");
  });

  it("removeFromQueue removes only the matching entry", () => {
    enqueue({ location: "Library", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-1" });
    enqueue({ location: "Canteen", occurredAt: "2026-07-12T10:05:00.000Z", clientEventId: "evt-2" });

    removeFromQueue("evt-1");

    const queue = getQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].clientEventId).toBe("evt-2");
  });

  it("survives a fresh read (simulating a page reload) since localStorage is the source of truth", () => {
    enqueue({ location: "Playground", occurredAt: "2026-07-12T09:00:00.000Z", clientEventId: "evt-reload" });

    // A "reload" is simulated by calling getQueue() again with no in-memory
    // state carried over — there is none, by design; this just documents
    // that guarantee explicitly.
    const queueAfterReload = getQueue();
    expect(queueAfterReload).toHaveLength(1);
    expect(queueAfterReload[0].clientEventId).toBe("evt-reload");
  });

  it("getQueue returns an empty array if localStorage contains malformed JSON", () => {
    localStorage.setItem("antikuddus_sos_offline_queue", "{not valid json");
    expect(getQueue()).toEqual([]);
  });
});
