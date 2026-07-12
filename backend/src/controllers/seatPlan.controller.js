import * as seatPlanService from "../services/seatPlanning/seatPlan.service.js";
import { success } from "../utils/apiResponse.js";

// role: teacher only — generates and persists a seat plan (API.md §8).
export const createPlan = async (req, res) => {
  const plan = await seatPlanService.generatePlan(req.body);
  success(res, { statusCode: 201, message: "Seat plan generated successfully.", data: plan });
};

// role: any authenticated user.
export const getPlan = async (req, res) => {
  const plan = await seatPlanService.getPlanById(req.params.id);
  success(res, { statusCode: 200, message: "Seat plan retrieved.", data: plan });
};
