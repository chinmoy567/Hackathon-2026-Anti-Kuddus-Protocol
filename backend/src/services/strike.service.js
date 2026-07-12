import { ClassState } from "../models/domain/classState.model.js";
import { coarsenToDate } from "../utils/dateBucket.js";
import { emitStrikeUpdated } from "./socket.service.js";

// Follows the Complaint write on the Anonymous Store — a documented
// eventual-consistency step, self-healed by reconcileStrikeCount.js
// (database.md §6.1; Backend.md BE-3).
export const incrementStrike = async () => {
  const state = await ClassState.getOrCreate();
  state.strikeCount = Math.min(state.strikeCount + 1, 3);
  state.impeached = state.strikeCount === 3;
  state.lastStrikeAtBucket = coarsenToDate();
  if (state.impeached && !state.impeachedAtBucket) {
    state.impeachedAtBucket = coarsenToDate();
  }
  await state.save();

  emitStrikeUpdated({ strikeCount: state.strikeCount, impeached: state.impeached });
  return state;
};

export const getStrikeState = async () => {
  const state = await ClassState.getOrCreate();
  return {
    strikeCount: state.strikeCount,
    impeached: state.impeached,
    lastStrikeAtBucket: state.lastStrikeAtBucket,
  };
};
