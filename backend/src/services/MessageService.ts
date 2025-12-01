import {
  IMessageRequest,
  IMessageResponse,
  IPaginatedResponse,
} from "../types/index";
import { Message } from "@models/Message.model";
import { MessageRepository } from "@database/repositories/MessageRepository";
import EncryptionService from "./EncryptionService";
import logger from "./LoggerService";

export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async sendMessage(
    sender: string,
    messageData: IMessageRequest
  ): Promise<number> {
    const { content } = messageData;
    const encryptedContent = EncryptionService.encrypt(content);

    const message = new Message(sender, encryptedContent);
    const messageId = await this.messageRepository.create(message);

    logger.info("Message sent", { sender, messageId });
    return messageId;
  }

  async pollMessages(sinceId: number): Promise<IMessageResponse[]> {
    const messages = await this.messageRepository.findMessagesSince(
      sinceId,
      100
    );

    return messages.map((msg) => {
      const decryptedContent = EncryptionService.decrypt(msg.encrypted_content);
      return msg.toResponse(decryptedContent);
    });
  }

  async getMessageHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<IPaginatedResponse<IMessageResponse>> {
    const messages = await this.messageRepository.findAll(limit, offset);
    const total = await this.messageRepository.count();

    const decryptedMessages = messages.map((msg) => {
      const decryptedContent = EncryptionService.decrypt(msg.encrypted_content);
      return msg.toResponse(decryptedContent);
    });

    return {
      data: decryptedMessages,
      total,
      limit,
      offset,
    };
  }
}
