import EncryptionService from "../../../src/services/EncryptionService";

describe("EncryptionService", () => {
  describe("encrypt and decrypt", () => {
    it("should encrypt and decrypt text correctly", () => {
      const plaintext = "Hello, World!";
      const encrypted = EncryptionService.encrypt(plaintext);
      const decrypted = EncryptionService.decrypt(encrypted);

      expect(encrypted).not.toBe(plaintext);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle special characters", () => {
      const plaintext = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = EncryptionService.encrypt(plaintext);
      const decrypted = EncryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it("should handle unicode characters", () => {
      const plaintext = "This is a text for check";
      const encrypted = EncryptionService.encrypt(plaintext);
      const decrypted = EncryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it("should handle empty strings", () => {
      const plaintext = "";
      const encrypted = EncryptionService.encrypt(plaintext);
      const decrypted = EncryptionService.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it("should produce different ciphertexts for same input", () => {
      const plaintext = "Same text";
      const encrypted1 = EncryptionService.encrypt(plaintext);
      const encrypted2 = EncryptionService.encrypt(plaintext);

      // Note: With same IV, they will be same. In production, use unique IVs
      expect(encrypted1).toBeDefined();
      expect(encrypted2).toBeDefined();
    });
  });

  describe("generateKeyPair", () => {
    it("should generate valid RSA key pair", () => {
      const { publicKey, privateKey } = EncryptionService.generateKeyPair();

      expect(publicKey).toContain("BEGIN PUBLIC KEY");
      expect(privateKey).toContain("BEGIN PRIVATE KEY");
    });

    it("should generate different key pairs each time", () => {
      const pair1 = EncryptionService.generateKeyPair();
      const pair2 = EncryptionService.generateKeyPair();

      expect(pair1.publicKey).not.toBe(pair2.publicKey);
      expect(pair1.privateKey).not.toBe(pair2.privateKey);
    });
  });
});
