import { pool } from "@/config/db";

async function reset() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log("💣 Resetting database...");

    // ❗ ลำดับสำคัญ (ต้องลบ child → parent)
    await connection.execute(`SET FOREIGN_KEY_CHECKS = 0`);

    await connection.execute(`TRUNCATE TABLE trades`);
    await connection.execute(`TRUNCATE TABLE orders`);
    await connection.execute(`TRUNCATE TABLE wallets`);
    await connection.execute(`TRUNCATE TABLE transfers`);
    await connection.execute(`TRUNCATE TABLE withdrawals`);
    await connection.execute(`TRUNCATE TABLE deposits`);
    await connection.execute(`TRUNCATE TABLE assets`);
    await connection.execute(`TRUNCATE TABLE users`);

    await connection.execute(`SET FOREIGN_KEY_CHECKS = 1`);

    await connection.commit();

    console.log("✅ Reset completed!");
  } catch (err) {
    await connection.rollback();
    console.error("❌ Reset failed:", err);
  } finally {
    connection.release();
    process.exit();
  }
}

reset();
