import mongoose from "mongoose";
import { domainConn } from "../../config/db.js";

// Keeps the story's fixed numbers (2 Taka toll, 20% tax, conversion prices)
// as seeded, validated data instead of magic numbers in code (database.md §6.9).
const referenceConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "washroom_toll_amount_taka",
      "tiffin_tax_percent",
      "cricket_bat_price_taka",
      "jhalmuri_packet_price_taka",
    ],
  },
  value: { type: Number, required: true },
  description: { type: String, default: null },
});

export const ReferenceConfig = domainConn.model("ReferenceConfig", referenceConfigSchema);
