import type { KeyPair } from "../types";

export const CryptoUtils = {
  generateKeyPair: (): KeyPair => {
    const privateKey = Math.random().toString(36).substring(2, 15);
    const publicKey = btoa(privateKey);
    return { privateKey, publicKey };
  },

  encryptMessage: (message: string, publicKey: string): string => {
    return btoa(message + ":" + publicKey);
  },

  decryptMessage: (encrypted: string, privateKey: string): string => {
    try {
      const decrypted = atob(encrypted);
      return decrypted.split(":")[0];
    } catch {
      return "[Decryption failed]";
    }
  },
};
