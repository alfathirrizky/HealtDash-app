import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM questions");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
