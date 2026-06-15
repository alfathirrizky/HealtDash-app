import db from "../db.js";

class Gallery {
  async findAll() {
    const [results] = await db.query("SELECT * FROM educations");
    return results;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM educations WHERE id = ?", [id]);
    return rows;
  }

  async create(education) {
    const { id, user_id, image, caption, description } = education;
    await db.query(
      "INSERT INTO educations (id, user_id, image, caption, description) VALUES (?, ?, ?, ?, ?)",
      [id, user_id, image, caption, description]
    );
  }

  async update(id, education) {
    const { image, caption, description } = education;
    await db.query(
      "UPDATE educations SET image=?, caption=?, description=? WHERE id=?",
      [image, caption, description, id]
    );
  }

  async delete(id) {
    await db.query("DELETE FROM educations WHERE id = ?", [id]);
  }
}

export default Gallery;
