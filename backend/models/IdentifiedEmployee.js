import db from "../db.js";

class IdentifiedEmployee {
  async findAll() {
    const [results] = await db.query(
      "SELECT * FROM identified_employees ORDER BY created_at DESC"
    );
    return results;
  }

  async create(data) {
    const {
      employee_name,
      stress_level,
      work_hours,
      sleep_quality,
      risk_score,
      risk_level,
      dominant_factor,
    } = data;
    const [result] = await db.query(
      "INSERT INTO identified_employees (employee_name, stress_level, work_hours, sleep_quality, risk_score, risk_level, dominant_factor) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        employee_name,
        stress_level,
        work_hours,
        sleep_quality,
        risk_score,
        risk_level,
        dominant_factor,
      ]
    );
    return result;
  }

  async delete(id) {
    const [result] = await db.query(
      "DELETE FROM identified_employees WHERE id = ?",
      [id]
    );
    return result;
  }
}

export default IdentifiedEmployee;
