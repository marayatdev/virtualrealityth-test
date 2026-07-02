import { RowDataPacket } from "mysql2";
import { pool } from "@/config/db";
import { UserRegister } from "@/types/auth";

export class WalletService {
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
