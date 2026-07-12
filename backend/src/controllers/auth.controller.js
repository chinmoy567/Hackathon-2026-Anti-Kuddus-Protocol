import * as authService from "../services/auth.service.js";
import { success } from "../utils/apiResponse.js";
import { env } from "../config/env.js";
import { parseDurationMs } from "../utils/parseDuration.js";

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "strict",
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
