import { pool } from "@/config/db";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log("🌱 Seeding started...");

    // =========================
    // 1. USERS
    // =========================
    const userAId = uuidv4();
    const userBId = uuidv4();

    await connection.execute(
      `
      INSERT INTO users (id, email, password_hash, full_name)
      VALUES
      (?, ?, ?, ?),
      (?, ?, ?, ?)
      `,
      [
        userAId,
        "alice@test.com",
        "hashed_password",
        "Alice",
        userBId,
        "bob@test.com",
        "hashed_password",
        "Bob",
      ],
    );

    // =========================
    // 2. ASSETS
    // =========================
    const btcId = uuidv4();
    const thbId = uuidv4();

    await connection.execute(
      `
      INSERT INTO assets (id, symbol, name, type, precision_places)
      VALUES
      (?, 'BTC', 'Bitcoin', 'CRYPTO', 8),
      (?, 'THB', 'Thai Baht', 'FIAT', 2)
      `,
      [btcId, thbId],
    );

    // =========================
    // 3. WALLETS
    // =========================

    // Alice: มี BTC + THB
    await connection.execute(
      `
      INSERT INTO wallets (id, user_id, asset_id, available_balance)
      VALUES
      (?, ?, ?, ?),
      (?, ?, ?, ?)
      `,
      [
        uuidv4(),
        userAId,
        btcId,
        1, // 1 BTC

        uuidv4(),
        userAId,
        thbId,
        1000000, // 1M THB
      ],
    );

    // Bob: มีแค่ THB
    await connection.execute(
      `
      INSERT INTO wallets (id, user_id, asset_id, available_balance)
      VALUES
      (?, ?, ?, ?)
      `,
      [uuidv4(), userBId, thbId, 1000000],
    );

    await connection.commit();

    console.log("✅ Seed completed!");
    console.log({
      userAId,
      userBId,
      btcId,
      thbId,
    });
  } catch (err) {
    await connection.rollback();
    console.error("❌ Seed failed:", err);
  } finally {
    connection.release();
    process.exit();
  }
}

seed();
