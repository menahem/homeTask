import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "@config/index";
import { createRoutes } from "@routes/index";
import { errorHandler, notFoundHandler } from "@middleware/error.middleware";
import { requestLogger } from "@middleware/logger.middleware";

export const createApp = (): Application => {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  app.use(
    cors({
      origin: config.corsOrigins,
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  app.use(express.json());
  app.use(requestLogger);
  app.use("/api", createRoutes());
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
