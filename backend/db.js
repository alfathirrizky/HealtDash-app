import mysql from "mysql2/promise";

// Konfigurasi koneksi database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthdash",
});

console.log("database connected");

export default db;
