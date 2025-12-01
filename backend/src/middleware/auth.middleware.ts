import { Request, Response, NextFunction } from "express";
import { AuthService } from "@services/AuthService";
import { AppError, ErrorCode } from "../types/index";
import logger from "@services/LoggerService";

export const authenticate = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      if (!token) {
        logger.warn("Authentication failed: No token provided", { ip: req.ip });
        throw new AppError(
          401,
          "Access token required",
          ErrorCode.AUTHENTICATION_ERROR
        );
      }

      const payload = authService.verifyToken(token);
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
};
