import * as complaintService from "../services/complaint.service.js";
import { success } from "../utils/apiResponse.js";

// Auth: X-Anonymous-Token (purpose=complaint), not a session token.
export const create = async (req, res) => {
  const { category, description, evidenceFileIds } = req.body;
  await complaintService.createComplaint({ category, description, evidenceFileIds }, req.anonymousToken);
  // Deliberately data: null — nothing linkable is ever returned (API.md §5 API-3).
  success(res, { statusCode: 201, data: null });
};

// role: teacher, captain_2nd, captain_3rd only — captain_1st excluded (API.md §5, API-7).
export const list = async (req, res) => {
  const { status, category, page, limit } = req.query;
  const result = await complaintService.listComplaints({
    status,
    category,
    page: page || 1,
    limit: limit || 20,
  });
  success(res, { statusCode: 200, data: result });
};

// role: teacher only — the legitimacy triage authority (API.md §5, API-2).
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await complaintService.adjudicateComplaint(id, status, req.user.role);
  success(res, { statusCode: 200, data: result });
};
