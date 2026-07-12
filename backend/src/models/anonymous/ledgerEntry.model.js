import mongoose from "mongoose";
import { anonymousConn } from "../../config/db.js";

// Mission 4 core record. No timestamps: true — only the coarsened bucket
// field is stored, never a raw new Date() (database.md §4 rule 8).
const ledgerEntrySchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["cash", "food"], index: true },
  source: { type: String, required: true, enum: ["washroom_toll", "tiffin_tax"], index: true },
  // Cash only — always server-set from reference_config, never client input (API.md API-4).
  amount: { type: Number, default: null },
  // Food only — cross-store ref to domain_db.food_catalog (database.md §9 allowed exception).
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCatalog", default: null },
  quantity: { type: Number, default: null, min: 1, max: 20 },
  loggedAtBucket: { type: Date, required: true, index: true },
});

export const LedgerEntry = anonymousConn.model("LedgerEntry", ledgerEntrySchema);
