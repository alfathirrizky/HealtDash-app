import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Membuat connection pool
// Pool = koneksi dipakai ulang (lebih efisien)
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "healthd1_Alfathir",
  password: process.env.DB_PASS || "Alfathir03_",
  database: process.env.DB_NAME || "healthd1_HealthDash",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("database connected");

export default db;
