import { Request, Response, NextFunction } from "express";
import { AppError, IApiError } from "../types/index";
import logger from "@services/LoggerService";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn("Application error", {
      code: err.code,
      message: err.message,
      path: req.path,
      method: req.method,
    });

    const errorResponse: IApiError = {
      error: err.message,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(err.statusCode).json(errorResponse);
  } else {
    logger.error("Unhandled error", {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    const errorResponse: IApiError = {
      error: "Internal server error",
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(500).json(errorResponse);
  }
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn("Route not found", { path: req.path, method: req.method });

  const errorResponse: IApiError = {
    error: "Route not found",
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  res.status(404).json(errorResponse);
};
