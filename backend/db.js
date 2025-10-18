import mysql from "mysql2/promise";

// Konfigurasi koneksi database
const db = mysql.createPool({
  host: "localhost",
  user: "root", // ganti sesuai user MySQL kamu
  password: "", // isi password MySQL kamu
  database: "healthdash", // nama database
});

// Cek koneksi
console.log("database connected");

export default db;
