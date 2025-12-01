import { IMessage, IMessageResponse } from "../types/index";
import { IsString, IsNotEmpty } from "class-validator";

export class Message implements IMessage {
  id?: number;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  encrypted_content: string;

  created_at?: Date;

  constructor(sender: string, encrypted_content: string, id?: number) {
    this.sender = sender;
    this.encrypted_content = encrypted_content;
    this.id = id;
    this.created_at = new Date();
  }

  static fromDatabase(row: any): Message {
    const message = new Message(row.sender, row.encrypted_content, row.id);
    message.created_at = new Date(row.created_at);
    return message;
  }

  toResponse(decryptedContent: string): IMessageResponse {
    return {
      id: this.id!,
      sender: this.sender,
      content: decryptedContent,
      timestamp: this.created_at!,
    };
  }
}
