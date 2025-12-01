import { Request, Response, NextFunction } from "express";
import { UserRepository } from "@database/repositories/UserRepository";
import { MessageRepository } from "@database/repositories/MessageRepository";
import { IStatsResponse } from "../types/index";
import cluster from "cluster";

export class StatsController {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userCount = await this.userRepository.count();
      const messageCount = await this.messageRepository.count();

      const stats: IStatsResponse = {
        users: userCount,
        messages: messageCount,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        worker: cluster.worker?.id || null,
      };

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  getHealth = (_req: Request, res: Response): void => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      worker: cluster.worker?.id,
    });
  };
}
