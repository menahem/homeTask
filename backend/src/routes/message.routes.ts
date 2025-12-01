import { Router } from "express";
import { MessageController } from "@controllers/MessageController";
import { authenticate } from "@middleware/auth.middleware";
import { AuthService } from "@services/AuthService";

export const createMessageRoutes = (
  messageController: MessageController,
  authService: AuthService
): Router => {
  const router = Router();

  // All message routes require authentication
  router.use(authenticate(authService));

  router.post("/send", messageController.sendMessage);
  router.get("/poll", messageController.pollMessages);
  router.get("/history", messageController.getHistory);

  return router;
};
