import { FoodCatalog } from "../models/domain/foodCatalog.model.js";

export const listItems = async () => {
  const items = await FoodCatalog.find();
  return {
    items: items.map((i) => ({
      id: i._id,
      name: i.name,
      caloriesPerUnit: i.caloriesPerUnit,
      category: i.category,
      unitLabel: i.unitLabel,
    })),
  };
};
