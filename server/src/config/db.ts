import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { logger } from "@/utils/logger";

dotenv.config();

const validateEnv = () => {
  const requiredEnv = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
  ];

  for (const env of requiredEnv) {
    if (!process.env[env]) {
      logger.error(`❌ Missing required environment variable: ${env}`);
      process.exit(1);
    }
  }
};

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectDB = async (): Promise<void> => {
  validateEnv();

  try {
    const connection = await pool.getConnection();
    logger.info(
      `✅ MySQL connected: ${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );
    connection.release();
  } catch (err) {
    logger.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
};
