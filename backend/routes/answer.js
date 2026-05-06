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

// GET aggregated stress factors (avg score per question type/category)
router.get("/stress-factors", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.type AS category,
        ROUND(AVG(CAST(a.answer AS DECIMAL(10,2))), 2) AS avg_score,
        COUNT(DISTINCT a.user_id) AS total_respondents,
        COUNT(a.id) AS total_responses
      FROM answers a
      JOIN questions q ON a.question_id = q.question_id
      GROUP BY q.type
      ORDER BY avg_score DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching stress factors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET stress factors filtered by survey_id
router.get("/stress-factors-by-survey", async (req, res) => {
  try {
    const { survey_id } = req.query;
    let query = `
      SELECT 
        q.type AS category,
        ROUND(AVG(CAST(a.answer AS DECIMAL(10,2))), 2) AS avg_score,
        COUNT(DISTINCT a.user_id) AS total_respondents,
        COUNT(a.id) AS total_responses
      FROM answers a
      JOIN questions q ON a.question_id = q.question_id
    `;
    const params = [];
    if (survey_id) {
      query += ` WHERE a.survey_id = ?`;
      params.push(survey_id);
    }
    query += ` GROUP BY q.type ORDER BY avg_score DESC`;
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching stress factors by survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
