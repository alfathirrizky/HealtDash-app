import db from "../db.js";

class Answer {
  async findAll() {
    const [rows] = await db.query("SELECT * FROM answers");
    return rows;
  }

  async findSurveyResults() {
    const [rows] = await db.query(`
      SELECT sr.*, u.name AS user_name, u.email AS user_email, u.position AS user_position
      FROM survey_results sr
      LEFT JOIN users u ON sr.user_id = u.id
      ORDER BY sr.created_at DESC
    `);
    return rows;
  }

  async findDetailedAnswers() {
    const [rows] = await db.query(`
      SELECT 
        u.name AS employee_name,
        s.title AS survey_title,
        s.category AS survey_category,
        q.question AS question_label,
        a.answer AS answer_text
      FROM answers a
      JOIN users u ON a.user_id = u.id
      JOIN questions q ON a.question_id = q.id
      JOIN surveys s ON a.survey_id = s.id
      ORDER BY u.name, q.id
    `);
    return rows;
  }

  async findHistoryByUserId(userId) {
    const [rows] = await db.query(`
      SELECT DISTINCT s.id, s.title, s.image, s.caption 
      FROM answers a
      JOIN surveys s ON a.survey_id = s.id
      WHERE a.user_id = ?
    `, [userId]);
    return rows;
  }

  async insertMany(values) {
    await db.query(
      "INSERT INTO answers (survey_id, question_id, user_id, answer) VALUES ?",
      [values]
    );
  }

  async findUserById(userId) {
    const [rows] = await db.query("SELECT name FROM users WHERE id = ?", [userId]);
    return rows;
  }

  async findSurveyResultByUserId(userId) {
    const [rows] = await db.query("SELECT * FROM survey_results WHERE user_id = ?", [userId]);
    return rows;
  }

  async findQuestionsBySurveyId(surveyId) {
    const [rows] = await db.query(
      "SELECT *, id AS question_id, question AS label FROM questions WHERE survey_id = ?", [surveyId]
    );
    return rows;
  }

  async findSurveyCategory(surveyId) {
    const [rows] = await db.query("SELECT category FROM surveys WHERE id = ?", [surveyId]);
    return rows;
  }

  async updateSurveyResult(user_id, userName, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor) {
    await db.query(
      "UPDATE survey_results SET employee_name = ?, stress_level = ?, work_hours = ?, sleep_quality = ?, risk_score = ?, risk_level = ?, dominant_factor = ? WHERE user_id = ?",
      [userName, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor, user_id]
    );
  }

  async insertSurveyResult(userName, user_id, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor) {
    await db.query(
      "INSERT INTO survey_results (employee_name, user_id, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userName,
        user_id,
        stress_level,
        work_hours,
        sleep_quality,
        risk_score,
        risk_level,
        dominant_factor,
      ]
    );
  }
}

export default Answer;
