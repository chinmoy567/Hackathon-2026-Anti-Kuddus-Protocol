import jwt from "jsonwebtoken";
import { env } from "../src/config/env.js";

// Fabricates a valid access token for a given role, bypassing /auth/login —
// authenticate.js only checks the signature and { sub, role } payload shape.
export const signTestToken = (role, id = "000000000000000000000001") =>
  jwt.sign({ sub: id, role }, env.jwtAccessSecret, { expiresIn: "15m" });
