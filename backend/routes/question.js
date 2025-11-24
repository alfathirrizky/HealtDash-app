import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  db.query("SELECT * FROM questions", (error, results) => {
    if (error) {
      console.error("❌ Error fetching questions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

export default router;
