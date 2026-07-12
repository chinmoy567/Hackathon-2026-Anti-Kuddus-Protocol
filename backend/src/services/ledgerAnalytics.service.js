import { LedgerEntry } from "../models/anonymous/ledgerEntry.model.js";

// Derived on read from ledger_entries — no separate aggregate storage
// (database.md §6.9). cashTotal/foodTotal power the ledger:updated socket
// payload (API.md "Real-Time Events"); `series` is Task 2's addition for
// GET /ledger/summary's time-series chart data.
export const getSummary = async ({ groupBy = "day" } = {}) => {
  const bucketExpr =
    groupBy === "week"
      ? { $dateTrunc: { date: "$loggedAtBucket", unit: "week", startOfWeek: "monday" } }
      : "$loggedAtBucket";

  const rows = await LedgerEntry.aggregate([
    {
      $group: {
        _id: { bucket: bucketExpr, type: "$type" },
        cash: { $sum: { $cond: [{ $eq: ["$type", "cash"] }, "$amount", 0] } },
        food: { $sum: { $cond: [{ $eq: ["$type", "food"] }, "$quantity", 0] } },
      },
    },
    { $group: { _id: "$_id.bucket", cash: { $sum: "$cash" }, food: { $sum: "$food" } } },
    { $sort: { _id: 1 } },
  ]);

  const series = rows.map((row) => ({
    bucket: row._id.toISOString().slice(0, 10),
    cash: row.cash,
    food: row.food,
  }));

  const cashTotal = series.reduce((sum, row) => sum + row.cash, 0);
  const foodTotal = series.reduce((sum, row) => sum + row.food, 0);

  return { cashTotal, foodTotal, series };
};
