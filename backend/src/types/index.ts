export interface IUser {
  id?: number | null;
  username: string;
  password_hash: string;
  public_key: string;
  created_at?: Date | null;
}

export interface IMessage {
  id?: number;
  sender: string;
  encrypted_content: string;
  created_at?: Date;
}

export interface IMessageResponse {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface IAuthRequest {
  username: string;
  password: string;
  publicKey: string;
}

export interface IAuthResponse {
  token: string;
  username: string;
}

export interface IMessageRequest {
  content: string;
}

export interface ITokenPayload {
  username: string;
  iat?: number;
  exp?: number;
}

export interface IConfig {
  port: number;
  nodeEnv: string;
  useHttps: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
  dbPath: string;
  corsOrigins: string[];
  maxConnections: number;
  workers: number;
  logLevel: string;
  logDir: string;
}

export interface IDatabaseConfig {
  path: string;
  options: {
    journalMode: string;
    synchronous: string;
    cacheSize: number;
    tempStore: string;
  };
}

export interface ISecurityConfig {
  bcryptRounds: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  encryptionAlgorithm: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface IStatsResponse {
  users: number;
  messages: number;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  worker?: number | null;
}

export interface IApiError {
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}
