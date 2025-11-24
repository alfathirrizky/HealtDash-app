import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  db.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("❌ Error fetching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

export default router;
