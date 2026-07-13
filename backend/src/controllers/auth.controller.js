import * as authService from "../services/auth.service.js";
import { success } from "../utils/apiResponse.js";
import { env } from "../config/env.js";
import { parseDurationMs } from "../utils/parseDuration.js";

// sameSite "none" is required cross-site (frontend and backend live on separate
// Render domains) and mandates secure:true — browsers reject "none" cookies
// otherwise. Falls back to "lax"/non-secure in local dev over http://localhost.
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: parseDurationMs(env.refreshTokenExpiresIn),
};

// Authenticate via roll-number + PIN; issues the access token in the body and
// the refresh token as an httpOnly cookie (API.md §2, API-6).
export const login = async (req, res) => {
  const { rollNumber, pin } = req.body;
  const { accessToken, refreshToken, user } = await authService.login(rollNumber, pin);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTS);
  success(res, { statusCode: 200, data: { accessToken, user } });
};

export const refresh = async (req, res) => {
  const { accessToken, refreshToken } = await authService.rotateRefreshToken(req.cookies?.refreshToken);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTS);
  success(res, { statusCode: 200, data: { accessToken } });
};

export const logout = async (req, res) => {
  await authService.revokeRefreshToken(req.cookies?.refreshToken);
  res.clearCookie("refreshToken");
  success(res, { statusCode: 200, data: null });
};

export const me = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  success(res, { statusCode: 200, data: user });
};
