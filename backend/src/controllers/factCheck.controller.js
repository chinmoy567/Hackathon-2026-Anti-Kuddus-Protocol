import * as factCheckService from "../services/factCheck.service.js";
import { success } from "../utils/apiResponse.js";

// Auth: any authenticated role (API.md §12, baseline).
export const search = async (req, res) => {
  const { q } = req.query;
  const { matches } = await factCheckService.search(q);
  success(res, { statusCode: 200, data: { matches } });
};

// Auth: any authenticated role (API.md §12, advanced — semantic entailment).
export const verify = async (req, res) => {
  const { claim } = req.body;
  const result = await factCheckService.verify(claim);
  success(res, { statusCode: 200, data: result });
};
