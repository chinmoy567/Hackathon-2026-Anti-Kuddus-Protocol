import cron from "node-cron";
import { Complaint } from "../models/anonymous/complaint.model.js";
import { ClassState } from "../models/domain/classState.model.js";
import { coarsenToDate } from "./dateBucket.js";

// Self-heals ClassState after a crash between the Complaint write (Anonymous Store)
// and the ClassState write (Domain Store) — the two cannot share a transaction
// across connections (database.md §6.1). Reads only aggregate counts; never
// touches anything that could re-identify a submitter.
export const reconcileStrikeCount = async () => {
  const strikeCount = Math.min(await Complaint.countDocuments({ countedAsStrike: true }), 3);
  const state = await ClassState.getOrCreate();

  if (state.strikeCount === strikeCount && state.impeached === (strikeCount === 3)) {
    return; // already consistent
  }

  state.strikeCount = strikeCount;
  state.impeached = strikeCount === 3;
  if (state.impeached && !state.impeachedAtBucket) {
    state.impeachedAtBucket = coarsenToDate();
  }
  await state.save();
  console.log(`[reconcile] ClassState self-healed to strikeCount=${strikeCount}`);
};

export const scheduleReconciliation = () => {
  // Every 10 minutes — frequent enough to self-heal quickly, cheap enough to ignore.
  cron.schedule("*/10 * * * *", () => {
    reconcileStrikeCount().catch((err) => console.error("[reconcile] failed:", err.message));
  });
};
