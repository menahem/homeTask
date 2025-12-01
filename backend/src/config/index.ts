import dotenv from "dotenv";
import { IConfig } from "../types/index";

dotenv.config();

const config: IConfig = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  useHttps: process.env.USE_HTTPS === "true",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  dbPath: process.env.DB_PATH || "./secure_messages.db",
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000"],
  maxConnections: parseInt(process.env.MAX_CONNECTIONS || "10000", 10),
  workers: parseInt(process.env.WORKERS || "4", 10),
  logLevel: process.env.LOG_LEVEL || "info",
  logDir: process.env.LOG_DIR || "logs",
};

if (config.nodeEnv === "production") {
  if (config.jwtSecret === "default-secret-change-in-production") {
    throw new Error("JWT_SECRET must be set in production");
  }
}

export default config;
