import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { renderHook, waitFor } from "@testing-library/react";
import { apiSlice } from "../store/apiSlice.js";
import { axiosClient } from "../api/axiosClient.js";
import { useSosOfflineSync } from "./useSosOfflineSync.js";
import { enqueue, getQueue } from "../utils/sosOfflineQueue.js";

const renderWithStore = () => {
  const store = configureStore({
    reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });
  return renderHook(() => useSosOfflineSync(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe("useSosOfflineSync", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("drains a queued entry on mount when the request succeeds", async () => {
    enqueue({ location: "Library", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-ok" });
    vi.spyOn(axiosClient, "request").mockResolvedValue({ data: { data: { id: "abc", status: "active" } } });

    renderWithStore();

    await waitFor(() => expect(getQueue()).toHaveLength(0));
  });

  it("leaves the entry queued when the request keeps failing", async () => {
    enqueue({ location: "Canteen", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-fail" });
    vi.spyOn(axiosClient, "request").mockRejectedValue({ response: undefined, message: "Network Error" });

    renderWithStore();

    // Give the drain attempt a moment to run and fail.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(getQueue()).toHaveLength(1);
    expect(getQueue()[0].clientEventId).toBe("evt-fail");
  });

  it("re-attempts drain on the browser online event", async () => {
    enqueue({ location: "Corridor", occurredAt: "2026-07-12T10:00:00.000Z", clientEventId: "evt-later" });
    const requestSpy = vi
      .spyOn(axiosClient, "request")
      .mockResolvedValue({ data: { data: { id: "xyz", status: "active" } } });

    renderWithStore();
    await waitFor(() => expect(getQueue()).toHaveLength(0));

    enqueue({ location: "Classroom", occurredAt: "2026-07-12T11:00:00.000Z", clientEventId: "evt-second" });
    window.dispatchEvent(new Event("online"));

    await waitFor(() => expect(getQueue()).toHaveLength(0));
    expect(requestSpy).toHaveBeenCalled();
  });
});
