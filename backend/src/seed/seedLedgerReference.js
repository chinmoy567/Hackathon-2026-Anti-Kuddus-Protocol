import { FoodCatalog } from "../models/domain/foodCatalog.model.js";
import { ReferenceConfig } from "../models/domain/referenceConfig.model.js";
import { domainConn } from "../config/db.js";

// Mission 4 seed data (database.md §6.8-6.9) — the food-calorie catalog and
// fixed monetary/percentage constants are not provided by the problem
// statement and must be authored by the team.
// Run with: npm run seed:ledger  (idempotent — safe to re-run).
const FOOD_CATALOG = [
  { name: "Fried Rice", caloriesPerUnit: 550, category: "desirable_tiffin", unitLabel: "plate" },
  { name: "Sandwich", caloriesPerUnit: 350, category: "desirable_tiffin", unitLabel: "piece" },
  { name: "Singara", caloriesPerUnit: 150, category: "standard_tiffin", unitLabel: "piece" },
  { name: "Biscuit Pack", caloriesPerUnit: 200, category: "standard_tiffin", unitLabel: "pack" },
  { name: "Banana", caloriesPerUnit: 105, category: "standard_tiffin", unitLabel: "piece" },
];

const REFERENCE_CONFIG = [
  { key: "washroom_toll_amount_taka", value: 2, description: "Fixed 2-Taka washroom toll per incident." },
  { key: "tiffin_tax_percent", value: 20, description: "20% Quality Control Tax on desirable tiffins." },
  { key: "cricket_bat_price_taka", value: 1500, description: "Price of one international-standard cricket bat, in Taka." },
  { key: "jhalmuri_packet_price_taka", value: 30, description: "Price of one packet of premium jhalmuri, in Taka." },
];

const seed = async () => {
  await domainConn.asPromise();

  for (const item of FOOD_CATALOG) {
    await FoodCatalog.findOneAndUpdate({ name: item.name }, item, { upsert: true });
  }
  for (const entry of REFERENCE_CONFIG) {
    await ReferenceConfig.findOneAndUpdate({ key: entry.key }, entry, { upsert: true });
  }

  console.log("Ledger reference data seeded.");
  console.table(FOOD_CATALOG);
  console.table(REFERENCE_CONFIG);

  await domainConn.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
