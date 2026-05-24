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

    // Cek apakah karyawan dengan nama yang sama sudah ada di database
    const [existing] = await db.query(
      "SELECT id FROM identified_employees WHERE employee_name = ?",
      [employee_name]
    );

    if (existing.length > 0) {
      // Jika sudah ada, lakukan UPDATE
      const [result] = await db.query(
        "UPDATE identified_employees SET stress_level = ?, work_hours = ?, sleep_quality = ?, risk_score = ?, risk_level = ?, dominant_factor = ? WHERE employee_name = ?",
        [
          stress_level,
          work_hours,
          sleep_quality,
          risk_score,
          risk_level,
          dominant_factor,
          employee_name,
        ]
      );
      return result;
    } else {
      // Jika belum ada, lakukan INSERT
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
