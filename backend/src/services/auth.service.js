import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Student } from "../models/identity/student.model.js";
import { RefreshToken } from "../models/identity/refreshToken.model.js";
import { env } from "../config/env.js";
import { hashToken, generateRawToken } from "../utils/tokenHash.js";
import { parseDurationMs } from "../utils/parseDuration.js";
import { AppError, AuthError } from "../utils/errors.js";

const signAccessToken = (student) =>
  jwt.sign({ sub: student._id.toString(), role: student.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });

const issueRefreshToken = async (studentId) => {
  const rawToken = generateRawToken();
  const expiresAt = new Date(Date.now() + parseDurationMs(env.refreshTokenExpiresIn));
  await RefreshToken.create({ studentId, tokenHash: hashToken(rawToken), expiresAt });
  return rawToken;
};

// Deliberately generic on every failure path — no user enumeration
// (API.md §2, §15: "no roll number not found vs wrong PIN").
export const login = async (rollNumber, pin) => {
  const student = await Student.findOne({ rollNumber });
  if (!student || !student.isActive) {
    throw new AuthError();
  }

  const pinMatches = await bcrypt.compare(pin, student.pinHash);
  if (!pinMatches) {
    throw new AuthError();
  }

  student.lastLoginAt = new Date();
  await student.save();

  const accessToken = signAccessToken(student);
  const refreshToken = await issueRefreshToken(student._id);

  return {
    accessToken,
    refreshToken,
    user: { id: student._id, name: student.name, role: student.role },
  };
};

// Rotation: the presented refresh token is revoked and a new pair is issued —
// prevents replay of a stolen refresh token past its first use.
export const rotateRefreshToken = async (rawToken) => {
  if (!rawToken) throw new AppError("Refresh token missing.", 401, "AUTH_REFRESH_INVALID");

  const tokenHash = hashToken(rawToken);
  const existing = await RefreshToken.findOne({ tokenHash, revoked: false });
  if (!existing || existing.expiresAt < new Date()) {
    throw new AppError("Refresh token is invalid or expired.", 401, "AUTH_REFRESH_INVALID");
  }

  existing.revoked = true;
  await existing.save();

  const student = await Student.findById(existing.studentId);
  if (!student || !student.isActive) {
    throw new AppError("Refresh token is invalid or expired.", 401, "AUTH_REFRESH_INVALID");
  }

  const accessToken = signAccessToken(student);
  const refreshToken = await issueRefreshToken(student._id);
  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (rawToken) => {
  if (!rawToken) return;
  await RefreshToken.updateOne({ tokenHash: hashToken(rawToken) }, { revoked: true });
};

export const getMe = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new AppError("Session expired or invalid.", 401, "UNAUTHENTICATED");
  return { id: student._id, name: student.name, rollNumber: student.rollNumber, role: student.role };
};
