import { LedgerEntry } from "../models/anonymous/ledgerEntry.model.js";
import { FoodCatalog } from "../models/domain/foodCatalog.model.js";
import { ReferenceConfig } from "../models/domain/referenceConfig.model.js";
import { coarsenToDate } from "../utils/dateBucket.js";
import { NotFoundError } from "../utils/errors.js";
import { emitLedgerUpdated } from "./socket.service.js";
import { getSummary } from "./ledgerAnalytics.service.js";

// Creates the ledger entry and consumes the anonymous token — mirrors
// complaint.service.createComplaint's shape. Returns nothing linkable
// (API.md §10: "no resource ID").
export const createEntry = async ({ type, foodItemId, quantity }, anonymousTokenCtx) => {
  const loggedAtBucket = coarsenToDate();
  let doc;

  if (type === "cash") {
    const tollConfig = await ReferenceConfig.findOne({ key: "washroom_toll_amount_taka" });
    doc = { type, source: "washroom_toll", amount: tollConfig.value, loggedAtBucket };
  } else {
    const foodItem = await FoodCatalog.findById(foodItemId);
    if (!foodItem) throw new NotFoundError("Food catalog item not found.");
    doc = { type, source: "tiffin_tax", foodItemId, quantity: quantity || 1, loggedAtBucket };
  }

  await LedgerEntry.create(doc);

  anonymousTokenCtx.doc.used = true;
  anonymousTokenCtx.doc.usedAtBucket = coarsenToDate();
  await anonymousTokenCtx.doc.save();

  const { cashTotal, foodTotal, caloricSurplus, conversions } = await getSummary({});
  emitLedgerUpdated({ cashTotal, foodTotal, caloricSurplus, conversions });
};
