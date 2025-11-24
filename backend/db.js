import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthdash",
  port: 3306,
});

console.log("database connected");

export default db;
