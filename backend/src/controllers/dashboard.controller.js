import * as strikeService from "../services/strike.service.js";
import { success } from "../utils/apiResponse.js";

// Any role — initial-load / reconnect fallback for the live socket updates.
export const getStrikeState = async (req, res) => {
  const state = await strikeService.getStrikeState();
  success(res, { statusCode: 200, data: state });
};
