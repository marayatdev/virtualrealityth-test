import { pool } from "@/config/db";
import { v4 as uuidv4 } from "uuid";

export class TransferService {
  async transfer(
    senderId: string,
    receiverEmail: string,
    assetId: string,
    amount: number,
  ) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. หา receiver
      const [receiverRows]: any = await connection.execute(
        `
        SELECT id
        FROM users
        WHERE email = ? AND status = 'ACTIVE'
        LIMIT 1
        `,
        [receiverEmail],
      );

      const receiver = receiverRows[0];

      if (!receiver) {
        throw new Error("Receiver not found");
      }

      // 2. ห้ามโอนให้ตัวเอง
      if (receiver.id === senderId) {
        throw new Error("Cannot transfer to yourself");
      }

      // 3. ตรวจ asset
      const [assetRows]: any = await connection.execute(
        `
        SELECT id
        FROM assets
        WHERE id = ? AND is_active = 1
        LIMIT 1
        `,
        [assetId],
      );

      const asset = assetRows[0];

      if (!asset) {
        throw new Error("Asset not found");
      }

      // 4. lock wallet sender
      const [senderWalletRows]: any = await connection.execute(
        `
        SELECT *
        FROM wallets
        WHERE user_id = ? AND asset_id = ?
        FOR UPDATE
        `,
        [senderId, assetId],
      );

      const senderWallet = senderWalletRows[0];

      if (!senderWallet) {
        throw new Error("Sender wallet not found");
      }

      // 5. lock wallet receiver
      const [receiverWalletRows]: any = await connection.execute(
        `
        SELECT *
        FROM wallets
        WHERE user_id = ? AND asset_id = ?
        FOR UPDATE
        `,
        [receiver.id, assetId],
      );

      let receiverWallet = receiverWalletRows[0];

      // ถ้า receiver ยังไม่มี wallet → สร้างให้
      if (!receiverWallet) {
        await connection.execute(
          `
          INSERT INTO wallets (id, user_id, asset_id)
          VALUES (?, ?, ?)
          `,
          [uuidv4(), receiver.id, assetId],
        );

        const [newWalletRows]: any = await connection.execute(
          `
          SELECT *
          FROM wallets
          WHERE user_id = ? AND asset_id = ?
          `,
          [receiver.id, assetId],
        );

        receiverWallet = newWalletRows[0];
      }

      // 6. ตรวจ balance
      if (Number(senderWallet.available_balance) < amount) {
        throw new Error("ยอดเงินไม่เพียงพอ");
      }

      // 7. update sender wallet
      await connection.execute(
        `
        UPDATE wallets
        SET available_balance = available_balance - ?
        WHERE user_id = ? AND asset_id = ?
        `,
        [amount, senderId, assetId],
      );

      // 8. update receiver wallet
      await connection.execute(
        `
        UPDATE wallets
        SET available_balance = available_balance + ?
        WHERE user_id = ? AND asset_id = ?
        `,
        [amount, receiver.id, assetId],
      );

      // 9. insert transfer
      const transferId = uuidv4();

      await connection.execute(
        `
        INSERT INTO transfers (
          id,
          from_user_id,
          to_user_id,
          asset_id,
          amount,
          status
        )
        VALUES (?, ?, ?, ?, ?, 'COMPLETED')
        `,
        [transferId, senderId, receiver.id, assetId, amount],
      );

      await connection.commit();

      return {
        message: "Transfer completed",
        transferId,
        amount,
        to: receiverEmail,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}
