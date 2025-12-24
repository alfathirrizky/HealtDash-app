import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Membuat connection pool
// Pool = koneksi dipakai ulang (lebih efisien)
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthdash",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("database connected");

export default db;
