import db from "../db.js";

class Question {
  async findAll() {
    const [results] = await db.query("SELECT * FROM questions");
    return results;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM questions WHERE id = ?", [id]);
    return rows;
  }

  async findBySurveyId(surveyId) {
    const [rows] = await db.query("SELECT * FROM questions WHERE survey_id = ?", [surveyId]);
    return rows;
  }

  async create(questionData) {
    const { id, survey_id, question } = questionData;
    await db.query(
      "INSERT INTO questions (id, survey_id, question) VALUES (?, ?, ?)",
      [id, survey_id, question]
    );
  }

  async update(id, questionData) {
    const { survey_id, question } = questionData;
    await db.query(
      "UPDATE questions SET survey_id = ?, question = ? WHERE id = ?",
      [survey_id, question, id]
    );
  }

  async delete(id) {
    await db.query("DELETE FROM questions WHERE id = ?", [id]);
  }
}

export default Question;
