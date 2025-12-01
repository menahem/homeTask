import { IUser } from "../types/index";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class User implements IUser {
  id?: number | null;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: "Username must be at least 3 characters" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsString()
  @IsNotEmpty()
  public_key: string;

  created_at?: Date;

  constructor(
    username: string,
    password_hash: string,
    public_key: string,
    id?: number
  ) {
    this.username = username;
    this.password_hash = password_hash;
    this.public_key = public_key;
    this.id = id || null;
    this.created_at = new Date();
  }

  static fromDatabase(row: any): User {
    const user = new User(
      row.username,
      row.password_hash,
      row.public_key,
      row.id
    );
    user.created_at = new Date(row.created_at);
    return user;
  }

  toSafeObject(): Omit<IUser, "password_hash"> {
    return {
      id: this.id || null,
      username: this.username,
      public_key: this.public_key,
      created_at: this.created_at || null,
    };
  }
}
