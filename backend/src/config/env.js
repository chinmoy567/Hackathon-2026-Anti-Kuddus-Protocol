import dotenv from "dotenv";

dotenv.config();

// Required at boot — fail fast rather than surface a confusing error mid-request.
const REQUIRED_VARS = [
  "MONGO_BASE_URI",
  "MONGO_DB_IDENTITY",
  "MONGO_DB_ANONYMOUS",
  "MONGO_DB_DOMAIN",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoBaseUri: process.env.MONGO_BASE_URI,
  mongoDbIdentity: process.env.MONGO_DB_IDENTITY,
  mongoDbAnonymous: process.env.MONGO_DB_ANONYMOUS,
  mongoDbDomain: process.env.MONGO_DB_DOMAIN,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  loginRateLimit: {
    max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 5,
    windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  },
  tokenIssuanceRateLimit: {
    max: Number(process.env.TOKEN_ISSUANCE_RATE_LIMIT_MAX) || 5,
    windowMs: Number(process.env.TOKEN_ISSUANCE_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000,
  },
  sosRateLimit: {
    max: Number(process.env.SOS_RATE_LIMIT_MAX) || 10,
    windowMs: Number(process.env.SOS_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  },
};
