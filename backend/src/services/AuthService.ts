import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  IAuthRequest,
  IAuthResponse,
  ITokenPayload,
  AppError,
  ErrorCode,
} from "../types/index";
import { User } from "@models/User.model";
import { UserRepository } from "@database/repositories/UserRepository";
import { securityConfig } from "@config/security.config";
import logger from "./LoggerService";
import type { StringValue } from "ms";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(authData: IAuthRequest): Promise<IAuthResponse> {
    const { username, password, publicKey } = authData;

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      logger.warn(`Registration failed: Username already exists`, { username });
      throw new AppError(409, "Username already exists", ErrorCode.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(
      password,
      securityConfig.bcryptRounds
    );

    const user = new User(username, passwordHash, publicKey);
    await this.userRepository.create(user);

    const token = this.generateToken(username);
    logger.info("User registered successfully", { username });
    return { token, username };
  }

  async login(authData: IAuthRequest): Promise<IAuthResponse> {
    const { username, password, publicKey } = authData;

    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      logger.warn("Login failed: User not found", { username });
      throw new AppError(
        401,
        "Invalid credentials",
        ErrorCode.AUTHENTICATION_ERROR
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      logger.warn("Login failed: Invalid password", { username });
      throw new AppError(
        401,
        "Invalid credentials",
        ErrorCode.AUTHENTICATION_ERROR
      );
    }

    if (publicKey) {
      user.public_key = publicKey;
      await this.userRepository.update(user);
    }

    const token = this.generateToken(username);

    logger.info("User logged in successfully", { username });
    return { token, username };
  }

  private generateToken(username: string): string {
    const payload: ITokenPayload = { username };
    return jwt.sign(payload, securityConfig.jwtSecret, {
      expiresIn: securityConfig.jwtExpiresIn as StringValue,
    });
  }

  verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, securityConfig.jwtSecret) as ITokenPayload;
    } catch (error) {
      throw new AppError(403, "Invalid token", ErrorCode.AUTHENTICATION_ERROR);
    }
  }
}
