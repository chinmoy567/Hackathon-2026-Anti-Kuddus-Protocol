import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Mission 4 seeded reference data — powers the ledger's food picker and the
// caloric disparity engine (database.md §6.8).
const foodCatalogSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  caloriesPerUnit: { type: Number, required: true },
  category: { type: String, enum: ["desirable_tiffin", "standard_tiffin"], default: "standard_tiffin" },
  unitLabel: { type: String, default: "item" },
});

export const FoodCatalog = domainConn.model("FoodCatalog", foodCatalogSchema);
