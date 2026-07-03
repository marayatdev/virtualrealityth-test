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

  async getAllWallets(userId: string) {
    const sql = `
    SELECT
      w.id AS wallet_id,
      a.id AS asset_id,
      a.symbol,
      a.name,
      a.type,
      w.available_balance,
      w.locked_balance
    FROM wallets w
    INNER JOIN assets a
      ON w.asset_id = a.id
    WHERE w.user_id = ?
      AND a.is_active = TRUE
    ORDER BY a.type, a.symbol
  `;

    const [rows] = await pool.execute(sql, [userId]);

    return rows;
  }

  async getWalletByAssetId(userId: string, assetId: string) {
    const sql = `
    SELECT
      w.id AS wallet_id,
      a.id AS asset_id,
      a.symbol,
      a.name,
      a.type,
      w.available_balance,
      w.locked_balance
    FROM wallets w
    INNER JOIN assets a
      ON w.asset_id = a.id
    WHERE w.user_id = ?
      AND w.asset_id = ?
    LIMIT 1
  `;

    const [rows] = await pool.execute(sql, [userId, assetId]);

    return (rows as any[])[0] || null;
  }

  async deposit(userId: string, assetId: string, amount: number) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. create deposit record
      await connection.execute(
        `
      INSERT INTO deposits (id, user_id, asset_id, amount, status)
      VALUES (UUID(), ?, ?, ?, 'CONFIRMED')
      `,
        [userId, assetId, amount],
      );

      // 2. update wallet balance
      await connection.execute(
        `
      UPDATE wallets
      SET available_balance = available_balance + ?
      WHERE user_id = ? AND asset_id = ?
      `,
        [amount, userId, assetId],
      );

      await connection.commit();

      return {
        message: "Deposit success",
        amount,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async withdraw(
    userId: string,
    assetId: string,
    amount: number,
    address: string,
  ) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [rows]: any = await connection.execute(
        `
      SELECT available_balance
      FROM wallets
      WHERE user_id = ? AND asset_id = ?
      FOR UPDATE
      `,
        [userId, assetId],
      );

      const wallet = rows[0];

      if (!wallet || wallet.available_balance < amount) {
        throw new Error("Insufficient balance");
      }

      await connection.execute(
        `
      UPDATE wallets
      SET available_balance = available_balance - ?
      WHERE user_id = ? AND asset_id = ?
      `,
        [amount, userId, assetId],
      );

      await connection.execute(
        `
      INSERT INTO withdrawals
      (id, user_id, asset_id, amount, address, status)
      VALUES (UUID(), ?, ?, ?, ?, 'PENDING')
      `,
        [userId, assetId, amount, address],
      );

      await connection.commit();

      return {
        message: "Withdraw request created",
        amount,
        address,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}
