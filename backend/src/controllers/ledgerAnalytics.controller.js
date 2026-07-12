import * as ledgerAnalyticsService from "../services/ledgerAnalytics.service.js";
import { success } from "../utils/apiResponse.js";

// role: any authenticated user (API.md §10).
export const getSummary = async (req, res) => {
  const { groupBy = "day" } = req.query;
  const result = await ledgerAnalyticsService.getSummary({ groupBy });
  success(res, { statusCode: 200, data: result });
};
