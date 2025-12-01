import { Request, Response, NextFunction } from "express";
import { MessageService } from "@services/MessageService";
import { IMessageRequest } from "../types/index";

export class MessageController {
  constructor(private messageService: MessageService) {}

  sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const sender = req.user!.username;
      const messageData: IMessageRequest = req.body;
      const messageId = await this.messageService.sendMessage(
        sender,
        messageData
      );

      res.status(200).json({
        success: true,
        messageId,
      });
    } catch (error) {
      next(error);
    }
  };

  pollMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const since = parseInt(req.query.since as string) || 0;
      const messages = await this.messageService.pollMessages(since);

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await this.messageService.getMessageHistory(limit, offset);

      res.status(200).json({
        messages: result.data,
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (error) {
      next(error);
    }
  };
}
