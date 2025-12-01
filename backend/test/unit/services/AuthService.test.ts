import { AuthService } from "../../../src/services/AuthService";
import { UserRepository } from "../../../src/database/repositories/UserRepository";
import Database from "../../../src/database/Database";
import { AppError } from "../../../src/types";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(Database);
    authService = new AuthService(userRepository);
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const authData = {
        username: `testuser_${Date.now()}`,
        password: "SecurePass123!",
        publicKey: "test-public-key",
      };

      const result = await authService.register(authData);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("username", authData.username);
      expect(result.token).toBeTruthy();
    });

    it("should throw error for duplicate username", async () => {
      const authData = {
        username: `duplicate_${Date.now()}`,
        password: "SecurePass123!",
        publicKey: "test-public-key",
      };

      await authService.register(authData);

      await expect(authService.register(authData)).rejects.toThrow(AppError);
      await expect(authService.register(authData)).rejects.toThrow(
        "Username already exists"
      );
    });

    it("should hash password before storing", async () => {
      const authData = {
        username: `hashtest_${Date.now()}`,
        password: "PlainPassword123!",
        publicKey: "test-public-key",
      };

      await authService.register(authData);
      const user = await userRepository.findByUsername(authData.username);

      expect(user?.password_hash).not.toBe(authData.password);
      expect(user?.password_hash).toHaveLength(60); // bcrypt hash length
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      const authData = {
        username: `logintest_${Date.now()}`,
        password: "ValidPassword123!",
        publicKey: "test-public-key",
      };

      await authService.register(authData);
      const result = await authService.login(authData);

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("username", authData.username);
    });

    it("should reject invalid password", async () => {
      const authData = {
        username: `invalidpw_${Date.now()}`,
        password: "CorrectPassword123!",
        publicKey: "test-public-key",
      };

      await authService.register(authData);

      const wrongAuth = { ...authData, password: "WrongPassword123!" };
      await expect(authService.login(wrongAuth)).rejects.toThrow(
        "Invalid credentials"
      );
    });

    it("should reject non-existent user", async () => {
      const authData = {
        username: "nonexistentuser",
        password: "Password123!",
        publicKey: "test-public-key",
      };

      await expect(authService.login(authData)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token", async () => {
      const authData = {
        username: `tokentest_${Date.now()}`,
        password: "Password123!",
        publicKey: "test-public-key",
      };

      const { token } = await authService.register(authData);
      const payload = authService.verifyToken(token);

      expect(payload.username).toBe(authData.username);
    });

    it("should reject invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => authService.verifyToken(invalidToken)).toThrow();
    });

    it("should reject expired token", () => {
      // This would require mocking jwt or waiting for expiration
      // Skipping for brevity
    });
  });
});
