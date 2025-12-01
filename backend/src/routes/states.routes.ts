import { Router } from "express";
import { StatsController } from "@controllers/StatsController";
import { authenticate } from "@middleware/auth.middleware";
import { AuthService } from "@services/AuthService";

export const createStatsRoutes = (
  statsController: StatsController,
  authService: AuthService
): Router => {
  const router = Router();
  router.get("/", authenticate(authService), statsController.getStats);

  return router;
};
