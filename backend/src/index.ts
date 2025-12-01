import http from "http";
import https from "https";
import fs from "fs";
import { createApp } from "./app";
import Database from "@database/Database";
import config from "@config/index";
import logger from "@services/LoggerService";

export const startServer = async (): Promise<http.Server | https.Server> => {
  try {
    await Database.initialize();
    const app = createApp();

    let server: http.Server | https.Server;

    if (
      config.useHttps &&
      fs.existsSync("key.pem") &&
      fs.existsSync("cert.pem")
    ) {
      const httpsOptions = {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      };
      server = https.createServer(httpsOptions, app);
      logger.info("HTTPS server configured");
    } else {
      server = http.createServer(app);
      logger.info("HTTP server configured");
    }

    server.maxConnections = config.maxConnections;

    server.listen(config.port, () => {
      logger.info("Server started successfully", {
        port: config.port,
        environment: config.nodeEnv,
        protocol: config.useHttps ? "HTTPS" : "HTTP",
        maxConnections: config.maxConnections,
      });
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await Database.close();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown", { error });
          process.exit(1);
        }
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    return server;
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

//if (require.main === module) {
startServer();
//}
