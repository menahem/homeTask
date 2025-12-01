import { IDatabaseConfig } from "../types/index";
import config from "./index";

export const databaseConfig: IDatabaseConfig = {
  path: config.dbPath,
  options: {
    journalMode: "WAL",
    synchronous: "NORMAL",
    cacheSize: 10000,
    tempStore: "MEMORY",
  },
};
