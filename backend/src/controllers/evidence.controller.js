import * as evidenceProcessingService from "../services/evidenceProcessing.service.js";
import { success } from "../utils/apiResponse.js";

// Auth: X-Anonymous-Token (purpose=complaint), validated but not consumed here.
export const upload = async (req, res) => {
  const result = await evidenceProcessingService.processEvidence(req.file.buffer);
  success(res, { statusCode: 201, data: result });
};
