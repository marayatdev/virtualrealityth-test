import { randomUUID } from "crypto";
import { RowDataPacket } from "mysql2";
import { pool } from "@/config/db";
import { UserRegister } from "@/types/auth";

interface User extends RowDataPacket {
  user_id: string;
  username: string;
  email: string;
  password: string;
}

export class AuthService {
  async getUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    return rows.length ? rows[0] : null;
  }

  async getUserById(userId: string): Promise<User | null> {
    const [rows] = await pool.execute<User[]>(
      "SELECT * FROM users WHERE user_id = ? LIMIT 1",
      [userId],
    );

    return rows.length ? rows[0] : null;
  }

  async registerUser(data: UserRegister & { user_id: string }) {
    const sql = `
    INSERT INTO users (user_id, username, email, password)
    VALUES (?, ?, ?, ?)
  `;

    await pool.execute(sql, [
      data.user_id,
      data.username,
      data.email,
      data.password,
    ]);

    return {
      user_id: data.user_id,
      username: data.username,
      email: data.email,
    };
  }
}
