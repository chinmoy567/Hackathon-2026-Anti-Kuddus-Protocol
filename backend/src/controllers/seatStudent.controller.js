import * as seatStudentService from "../services/seatStudent.service.js";
import { success } from "../utils/apiResponse.js";

// role: teacher only — administrator seeding roster records (API.md §8).
export const createBatch = async (req, res) => {
  const { batchId, students } = req.body;
  const result = await seatStudentService.upsertBatch(batchId, students);
  success(res, { statusCode: 201, message: "Roster batch saved.", data: result });
};

// role: any authenticated user.
export const getBatch = async (req, res) => {
  const { batchId } = req.params;
  const result = await seatStudentService.getBatch(batchId);
  success(res, { statusCode: 200, message: "Roster batch retrieved.", data: result });
};
