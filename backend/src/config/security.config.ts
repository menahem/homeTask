import { ISecurityConfig } from "../types/index";
import config from "./index";
import crypto from "crypto";

export const securityConfig: ISecurityConfig = {
  bcryptRounds: 12,
  jwtSecret: config.jwtSecret,
  jwtExpiresIn: config.jwtExpiresIn,
  encryptionAlgorithm: "aes-256-cbc",
};

//console.log(crypto.randomBytes(32).toString("hex"));
//console.log(crypto.randomBytes(16).toString("hex"));

// Generate encryption keys (in production, use key management service)
export const ENCRYPTION_KEY = Buffer.from(
  "76d3f83ef893b5e619bbdaf49ecf42bb3cc2bbeb02bebb0be1252918d3a08958",
  "hex"
);
export const ENCRYPTION_IV = Buffer.from(
  "de0c30b211083d3e48c49ecd9141760d",
  "hex"
);
