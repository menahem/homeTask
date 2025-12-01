import request from "supertest";
import { createApp } from "../../../src/app";
import Database from "../../../src/database/Database";
import { Application } from "express";

describe("Logic Tests", () => {
  let app: Application;
  let authToken: string;
  const testUser = {
    username: `integtest_${Date.now()}`,
    password: "TestPassword123!",
    publicKey: "test-public-key",
  };

  beforeAll(async () => {
    app = createApp();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("username", testUser.username);

      authToken = response.body.token;
    });

    it("should reject duplicate registration", async () => {
      await request(app).post("/api/auth/register").send(testUser).expect(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty("token");
    });

    it("should reject invalid credentials", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ ...testUser, password: "WrongPassword" })
        .expect(401);
    });
  });

  describe("POST /api/messages/send", () => {
    it("should send message with authentication", async () => {
      const response = await request(app)
        .post("/api/messages/send")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ content: "Test message" })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should reject without authentication", async () => {
      await request(app)
        .post("/api/messages/send")
        .send({ content: "Test message" })
        .expect(401);
    });
  });

  describe("GET /api/messages/poll", () => {
    it("should poll messages with authentication", async () => {
      const response = await request(app)
        .get("/api/messages/poll?since=0")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("messages");
      expect(Array.isArray(response.body.messages)).toBe(true);
    });

    it("should reject without authentication", async () => {
      await request(app).get("/api/messages/poll?since=0").expect(401);
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("uptime");
    });
  });
});
