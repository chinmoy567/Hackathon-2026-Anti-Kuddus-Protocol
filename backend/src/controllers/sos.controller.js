import * as sosService from "../services/sos.service.js";
import { success } from "../utils/apiResponse.js";

// role: student only — the spec's identified exception (API.md §11).
export const create = async (req, res) => {
  const { location, occurredAt, clientEventId } = req.body;
  const { alert, created } = await sosService.createSosAlert({
    studentId: req.user.id,
    location,
    occurredAt,
    clientEventId,
  });
  success(res, { statusCode: created ? 201 : 200, data: { id: alert._id, status: alert.status } });
};

// role: captain_2nd, captain_3rd only.
export const acknowledge = async (req, res) => {
  const result = await sosService.acknowledgeSosAlert(req.params.id, req.user.id);
  success(res, { statusCode: 200, data: result });
};

// role: captain_2nd, captain_3rd only.
export const resolve = async (req, res) => {
  const result = await sosService.resolveSosAlert(req.params.id);
  success(res, { statusCode: 200, data: result });
};

// role: captain_2nd, captain_3rd, teacher only — captain_1st excluded.
export const listActive = async (req, res) => {
  const result = await sosService.listActiveSosAlerts();
  success(res, { statusCode: 200, data: result });
};
