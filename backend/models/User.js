import db from "../db.js";

class User {
  async findAll() {
    const [results] = await db.query("SELECT * FROM users");
    return results;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows;
  }

  async create(user) {
    const { id, image, telepon, name, email, position, gender, hashedPassword, role } = user;
    await db.query(
      "INSERT INTO users (id, image, telepon, name, email, position, gender, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, image, telepon, name, email, position, gender, hashedPassword, role]
    );
  }

  async update(id, user) {
    const { image, telepon, name, email, position, gender, finalPassword, role } = user;
    await db.query(
      "UPDATE users SET image=?, telepon=?, name=?, email=?, position=?, gender=?, password=?, role=? WHERE id=?",
      [image, telepon, name, email, position, gender, finalPassword, role, id]
    );
  }

  async delete(id) {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
  }

  async findWithRelations(id) {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) return null;

    const user = users[0];

    const [surveyResults] = await db.query(
      "SELECT * FROM survey_results WHERE user_id = ? ORDER BY created_at DESC",
      [id]
    );

    return {
      ...user,
      survey_results: surveyResults,
    };
  }
}

export default User;
