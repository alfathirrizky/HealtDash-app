import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "healthdash",
  port: 3306,
});

const db = pool.promise();

console.log("database connected");

export default db;
