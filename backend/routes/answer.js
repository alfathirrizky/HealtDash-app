import express from "express";
import db from "../db.js";
import verifyToken from "../middleware/auth.js";
import axios from "axios";
import { PYTHON_API_URL } from "../config/index.js";

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

router.get("/history/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.query(`
      SELECT DISTINCT s.id, s.title, s.image, s.caption 
      FROM answers a
      JOIN surveys s ON a.survey_id = s.id
      WHERE a.user_id = ?
    `, [user_id]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching survey history:", error);
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

    // Jika survey_id adalah "1" (Survei Kesehatan Mental), jalankan prediksi burnout proaktif
    if (String(survey_id) === "1") {
      let stress_level = 0;
      let work_hours = 0;
      let sleep_quality = 0;

      // Ambil detail pertanyaan untuk mencocokkan question_id dengan nama field (stress_level, work_hours, sleep_quality)
      const [questions] = await db.query(
        "SELECT question_id, name FROM questions WHERE survey_id = '1'"
      );

      answers.forEach((ans) => {
        const q = questions.find((item) => String(item.question_id) === String(ans.question_id));
        if (q) {
          if (q.name === "stress_level") stress_level = parseInt(ans.answer) || 0;
          if (q.name === "work_hours") work_hours = parseFloat(ans.answer) || 0;
          if (q.name === "sleep_quality") sleep_quality = parseInt(ans.answer) || 0;
        }
      });

      // Panggil API Python untuk melakukan prediksi
      try {
        const response = await axios.post(`${PYTHON_API_URL}/predict/`, {
          stress_level,
          work_hours,
          sleep_quality,
        });

        const rec = response.data;

        // Ambil nama pengguna
        const [users] = await db.query("SELECT name FROM users WHERE id = ?", [user_id]);
        const userName = users.length > 0 ? users[0].name : "Karyawan";

        // Simpan hasil klasifikasi ke tabel identified_employees
        await db.query(
          "INSERT INTO identified_employees (employee_name, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            userName,
            stress_level,
            work_hours,
            sleep_quality,
            rec.risk_score,
            rec.risk_level,
            rec.dominant_factor,
          ]
        );
        console.log(`🚀 Burnout prediction saved for ${userName}: Risk Level = ${rec.risk_level}`);
      } catch (err) {
        console.error("❌ Python prediction call failed:", err.message);
      }
    }

    res.status(200).json({ message: "Survey submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET aggregated stress factors (avg score per question type/category) from identified_employees
router.get("/stress-factors", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        'stress_level' AS category,
        COALESCE(ROUND(AVG(stress_level), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
      UNION ALL
      SELECT 
        'work_hours' AS category,
        COALESCE(ROUND(AVG(work_hours), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
      UNION ALL
      SELECT 
        'sleep_quality' AS category,
        COALESCE(ROUND(AVG(sleep_quality), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
    `);
    
    // Sort rows by avg_score DESC
    rows.sort((a, b) => parseFloat(b.avg_score) - parseFloat(a.avg_score));
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching stress factors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET stress factors filtered by survey_id (pulling from identified_employees as well)
router.get("/stress-factors-by-survey", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        'stress_level' AS category,
        COALESCE(ROUND(AVG(stress_level), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
      UNION ALL
      SELECT 
        'work_hours' AS category,
        COALESCE(ROUND(AVG(work_hours), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
      UNION ALL
      SELECT 
        'sleep_quality' AS category,
        COALESCE(ROUND(AVG(sleep_quality), 2), 0.00) AS avg_score,
        COUNT(DISTINCT id) AS total_respondents,
        COUNT(id) AS total_responses
      FROM identified_employees
    `);
    
    rows.sort((a, b) => parseFloat(b.avg_score) - parseFloat(a.avg_score));
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching stress factors by survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
