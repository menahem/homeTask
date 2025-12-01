import sqlite3 from "sqlite3";
import { promisify } from "util";
import { databaseConfig } from "@config/database.config";
import logger from "@services/LoggerService";

export class Database {
  private db: sqlite3.Database;
  public run: (sql: string, params?: any[]) => Promise<sqlite3.RunResult>;
  public get: (sql: string, params?: any[]) => Promise<any>;
  public all: (sql: string, params?: any[]) => Promise<any[]>;

  constructor() {
    this.db = new sqlite3.Database(databaseConfig.path);
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async initialize(): Promise<void> {
    try {
      // Enable WAL mode for better concurrency
      await this.run(
        `PRAGMA journal_mode = ${databaseConfig.options.journalMode}`
      );
      await this.run(
        `PRAGMA synchronous = ${databaseConfig.options.synchronous}`
      );
      await this.run(`PRAGMA cache_size = ${databaseConfig.options.cacheSize}`);
      await this.run(`PRAGMA temp_store = ${databaseConfig.options.tempStore}`);

      // Create tables
      await this.createTables();

      logger.info("Database initialized successfully", {
        path: databaseConfig.path,
        journalMode: databaseConfig.options.journalMode,
      });
    } catch (error) {
      logger.error("Database initialization failed", { error });
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    // Users table
    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        public_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await this.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL,
        encrypted_content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender) REFERENCES users(username)
      )
    `);

    // Create indexes
    await this.run(
      "CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)"
    );
    await this.run(
      "CREATE INDEX IF NOT EXISTS idx_messages_id ON messages(id)"
    );
    await this.run(
      "CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender)"
    );
    await this.run(
      "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)"
    );

    logger.info("Database tables and indexes created");
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger.error("Error closing database", { error: err });
          reject(err);
        } else {
          logger.info("Database connection closed");
          resolve();
        }
      });
    });
  }

  getConnection(): sqlite3.Database {
    return this.db;
  }
}

export default new Database();
