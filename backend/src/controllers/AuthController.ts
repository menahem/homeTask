import { Request, Response, NextFunction } from "express";
import { AuthService } from "@services/AuthService";
import { IAuthRequest } from "../types/index";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authData: IAuthRequest = req.body;
      const result = await this.authService.register(authData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authData: IAuthRequest = req.body;
      const result = await this.authService.login(authData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
