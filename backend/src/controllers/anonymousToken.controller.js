import * as anonymousTokenService from "../services/anonymousToken.service.js";
import { success } from "../utils/apiResponse.js";

// role: student only — enforced by authorize('student') in the route.
export const issue = async (req, res) => {
  const { purpose } = req.body;
  const result = await anonymousTokenService.issueAnonymousToken(req.user.id, purpose);
  success(res, { statusCode: 201, data: result });
};
