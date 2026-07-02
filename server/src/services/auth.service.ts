import { RowDataPacket } from "mysql2";
import { pool } from "@/config/db";
import { UserRegister } from "@/types/auth";

interface User extends RowDataPacket {
  id: string;
  f_name: string;
  l_name: string;
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
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [userId],
    );

    return rows.length ? rows[0] : null;
  }

  async registerUser(data: UserRegister & { id: string }) {
    const sql = `
    INSERT INTO users (id, f_name, l_name, email, password)
    VALUES (?, ?, ?, ?, ?)
  `;

    await pool.execute(sql, [
      data.id,
      data.f_name,
      data.l_name,
      data.email,
      data.password,
    ]);

    return {
      id: data.id,
      f_name: data.f_name,
      l_name: data.l_name,
      email: data.email,
    };
  }

  async createDefaultWallets(userId: string) {
    const sql = `
        INSERT INTO wallets (id, user_id, asset_id)
        SELECT UUID(), ?, id
        FROM assets
        WHERE is_active = TRUE;
    `;

    await pool.execute(sql, [userId]);
  }
}
