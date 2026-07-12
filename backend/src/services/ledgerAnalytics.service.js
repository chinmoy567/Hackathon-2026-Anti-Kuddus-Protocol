import { LedgerEntry } from "../models/anonymous/ledgerEntry.model.js";

// Derived on read from ledger_entries — no separate aggregate storage
// (database.md §6.9). Minimal cashTotal/foodTotal used by the ledger:updated
// socket payload (API.md "Real-Time Events"); Task 2 extends this with a
// time-series `series` field for GET /ledger/summary.
export const getSummary = async () => {
  const [cashAgg] = await LedgerEntry.aggregate([
    { $match: { type: "cash" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const [foodAgg] = await LedgerEntry.aggregate([
    { $match: { type: "food" } },
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);

  return { cashTotal: cashAgg?.total || 0, foodTotal: foodAgg?.total || 0 };
};
