import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all questions
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM questions");
    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET question by id
router.get("/:id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM questions WHERE question_id = ?",
    [req.params.id]
  );
  if (!rows.length)
    return res.status(404).json({ error: "Question not found" });
  res.json(rows[0]);
});

// GET questions by survey_id
router.get("/survey/:surveyId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM questions WHERE survey_id = ?",
      [req.params.surveyId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE question
router.post("/", async (req, res) => {
  try {
    const question_id = uuidv4();
    const { survey_id, name, label, note, type } = req.body;
    await db.query(
      "INSERT INTO questions (question_id, survey_id, name, label, note, type) VALUES (?, ?, ?, ?, ?, ?)",
      [question_id, survey_id, name, label, note, type]
    );
    const [rows] = await db.query(
      "SELECT * FROM questions WHERE question_id = ?",
      [question_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// UPDATE question
router.put("/:id", async (req, res) => {
  try {
    const { name, label, note, type } = req.body;
    const [result] = await db.query(
      "UPDATE questions SET name = ?, label = ?, note = ?, type = ? WHERE question_id = ?",
      [name, label, note, type, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Question not found" });
    const [rows] = await db.query(
      "SELECT * FROM questions WHERE question_id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// DELETE question
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM questions WHERE question_id = ?", [req.params.id], );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


export default router;
