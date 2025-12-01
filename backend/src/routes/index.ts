import { Router } from "express";
import { AuthController } from "@controllers/AuthController";
import { MessageController } from "@controllers/MessageController";
import { StatsController } from "@controllers/StatsController";
import { AuthService } from "@services/AuthService";
import { MessageService } from "@services/MessageService";
import { UserRepository } from "@database/repositories/UserRepository";
import { MessageRepository } from "@database/repositories/MessageRepository";
import Database from "@database/Database";
import { createAuthRoutes } from "./auth.routes";
import { createMessageRoutes } from "./message.routes";
import { createStatsRoutes } from "./states.routes";

export const createRoutes = (): Router => {
  const router = Router();

  // Initialize repositories
  const userRepository = new UserRepository(Database);
  const messageRepository = new MessageRepository(Database);

  // Initialize services
  const authService = new AuthService(userRepository);
  const messageService = new MessageService(messageRepository);

  // Initialize controllers
  const authController = new AuthController(authService);
  const messageController = new MessageController(messageService);
  const statsController = new StatsController(
    userRepository,
    messageRepository
  );

  router.get("/health", statsController.getHealth);

  // Mount route modules
  router.use("/auth", createAuthRoutes(authController));
  router.use("/messages", createMessageRoutes(messageController, authService));
  router.use("/stats", createStatsRoutes(statsController, authService));

  return router;
};
