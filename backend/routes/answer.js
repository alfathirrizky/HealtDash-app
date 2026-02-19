import express from "express";
import db from "../db.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/api/answer", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM answers");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching answers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { survey_id, answers } = req.body; // <-- WAJIB ADA
    const user_id = req.user.id;

    if (!survey_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const values = answers.map((item) => [
      survey_id,
      item.question_id,
      user_id,
      item.answer,
    ]);

    await db.query(
      "INSERT INTO answers (survey_id, question_id, user_id, answer) VALUES ?",
      [values],
    );

    res.status(200).json({ message: "Survey submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
