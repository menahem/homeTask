import { Message } from "@models/Message.model";
import { Database } from "../Database";

export class MessageRepository {
  constructor(private db: Database) {}

  async create(message: Message): Promise<number> {
    const result = await this.db.run(
      "INSERT INTO messages (sender, encrypted_content) VALUES (?, ?)",
      [message.sender, message.encrypted_content]
    );
    return result?.lastID!;
  }

  async findById(id: number): Promise<Message | null> {
    const row = await this.db.get("SELECT * FROM messages WHERE id = ?", [id]);
    return row ? Message.fromDatabase(row) : null;
  }

  async findMessagesSince(
    sinceId: number,
    limit: number = 100
  ): Promise<Message[]> {
    const rows = await this.db.all(
      "SELECT * FROM messages WHERE id > ? ORDER BY id ASC LIMIT ?",
      [sinceId, limit]
    );
    return rows.map((row) => Message.fromDatabase(row));
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<Message[]> {
    const rows = await this.db.all(
      "SELECT * FROM messages ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows.map((row) => Message.fromDatabase(row)).reverse();
  }

  async findBySender(sender: string, limit: number = 50): Promise<Message[]> {
    const rows = await this.db.all(
      "SELECT * FROM messages WHERE sender = ? ORDER BY id DESC LIMIT ?",
      [sender, limit]
    );
    return rows.map((row) => Message.fromDatabase(row));
  }

  async delete(id: number): Promise<void> {
    await this.db.run("DELETE FROM messages WHERE id = ?", [id]);
  }

  async count(): Promise<number> {
    const result = await this.db.get("SELECT COUNT(*) as count FROM messages");
    return result.count;
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.db.run(
      "DELETE FROM messages WHERE created_at < ?",
      [date.toISOString()]
    );
    return result.changes || 0;
  }
}
