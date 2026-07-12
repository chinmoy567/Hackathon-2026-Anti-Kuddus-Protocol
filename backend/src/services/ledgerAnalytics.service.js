import { LedgerEntry } from "../models/anonymous/ledgerEntry.model.js";
import { FoodCatalog } from "../models/domain/foodCatalog.model.js";
import { ReferenceConfig } from "../models/domain/referenceConfig.model.js";

// Kuddus's active energy expenditure — modeled mathematically as zero (indoor
// Ludu lifestyle, a spec-defined constant per Requirements Report.md §Business
// Rules, not data to collect).
const KUDDUS_ENERGY_EXPENDITURE_CALORIES = 0;

// Anonymous Store (ledger_entries) and Domain Store (food_catalog,
// reference_config) are separate Mongoose connections/databases, so this is
// an application-side join, not a $lookup (database.md §9).
const getCaloricSurplus = async () => {
  const [foodEntries, foodItems] = await Promise.all([
    LedgerEntry.find({ type: "food" }).lean(),
    FoodCatalog.find().lean(),
  ]);

  const caloriesByFoodId = new Map(foodItems.map((item) => [item._id.toString(), item.caloriesPerUnit]));

  const totalCaloriesIntake = foodEntries.reduce((sum, entry) => {
    const caloriesPerUnit = caloriesByFoodId.get(entry.foodItemId?.toString()) || 0;
    return sum + entry.quantity * caloriesPerUnit;
  }, 0);

  return {
    totalCaloriesIntake,
    totalCaloriesExpended: KUDDUS_ENERGY_EXPENDITURE_CALORIES,
    surplus: totalCaloriesIntake - KUDDUS_ENERGY_EXPENDITURE_CALORIES,
  };
};

const getConversions = async (cashTotal) => {
  const configs = await ReferenceConfig.find({
    key: { $in: ["cricket_bat_price_taka", "jhalmuri_packet_price_taka"] },
  }).lean();
  const priceByKey = new Map(configs.map((c) => [c.key, c.value]));
  const cricketBatPrice = priceByKey.get("cricket_bat_price_taka");
  const jhalmuriPacketPrice = priceByKey.get("jhalmuri_packet_price_taka");

  return {
    cricketBats: cricketBatPrice ? Math.floor(cashTotal / cricketBatPrice) : 0,
    jhalmuriPackets: jhalmuriPacketPrice ? Math.floor(cashTotal / jhalmuriPacketPrice) : 0,
  };
};

// Derived on read from ledger_entries — no separate aggregate storage
// (database.md §6.9). cashTotal/foodTotal/caloricSurplus/conversions power
// the ledger:updated socket payload (API.md "Real-Time Events"); `series` is
// Task 2's time-series data for GET /ledger/summary.
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

  const [caloricSurplus, conversions] = await Promise.all([getCaloricSurplus(), getConversions(cashTotal)]);

  return { cashTotal, foodTotal, series, caloricSurplus, conversions };
};
