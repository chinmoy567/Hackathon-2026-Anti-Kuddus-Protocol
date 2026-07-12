import * as ledgerEntryService from "../services/ledgerEntry.service.js";
import * as foodCatalogService from "../services/foodCatalog.service.js";
import { success } from "../utils/apiResponse.js";

// Auth: X-Anonymous-Token (purpose=ledger_entry), not a session token.
export const createEntry = async (req, res) => {
  const { type, foodItemId, quantity } = req.body;
  await ledgerEntryService.createEntry({ type, foodItemId, quantity }, req.anonymousToken);
  // Deliberately data: null — no linkable resource id returned (API.md API-3).
  success(res, { statusCode: 201, data: null });
};

// role: any authenticated user.
export const listFoodCatalog = async (req, res) => {
  const result = await foodCatalogService.listItems();
  success(res, { statusCode: 200, data: result });
};
