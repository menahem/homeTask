import { User } from "@models/User.model";
import { Database } from "@database/Database";

export class UserRepository {
  constructor(private db: Database) {}

  async create(user: User): Promise<number> {
    const result = await this.db.run(
      "INSERT INTO users (username, password_hash, public_key) VALUES (?, ?, ?)",
      [user.username, user.password_hash, user.public_key]
    );
    return result?.lastID!;
  }

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.db.get("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return row ? User.fromDatabase(row) : null;
  }

  async findById(id: number): Promise<User | null> {
    const row = await this.db.get("SELECT * FROM users WHERE id = ?", [id]);
    return row ? User.fromDatabase(row) : null;
  }

  async update(user: User): Promise<void> {
    await this.db.run(
      "UPDATE users SET password_hash = ?, public_key = ? WHERE username = ?",
      [user.password_hash, user.public_key, user.username]
    );
  }

  async delete(username: string): Promise<void> {
    await this.db.run("DELETE FROM users WHERE username = ?", [username]);
  }

  async count(): Promise<number> {
    const result = await this.db.get("SELECT COUNT(*) as count FROM users");
    return result.count;
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    const rows = await this.db.all(
      "SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows.map((row) => User.fromDatabase(row));
  }
}
