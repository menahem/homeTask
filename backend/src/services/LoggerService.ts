import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "@config/index";

class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      new DailyRotateFile({
        filename: `${config.logDir}/error-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        level: "error",
        maxSize: "20m",
        maxFiles: "14d",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
      new DailyRotateFile({
        filename: `${config.logDir}/combined-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "14d",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ];

    if (config.nodeEnv !== "production") {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`
            )
          ),
        })
      );
    }

    this.logger = winston.createLogger({
      level: config.logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports,
    });
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  http(message: string, meta?: any): void {
    this.logger.http(message, meta);
  }
}

export default new LoggerService();
