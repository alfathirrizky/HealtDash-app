import db from "../db.js";

class Gallery {
  async findAll() {
    const [results] = await db.query("SELECT * FROM albums");
    return results;
  }

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
    return rows;
  }

  async create(album) {
    const { id, user_id, image, caption, description } = album;
    await db.query(
      "INSERT INTO albums (id, user_id, image, caption, description) VALUES (?, ?, ?, ?, ?)",
      [id, user_id, image, caption, description]
    );
  }

  async update(id, album) {
    const { image, caption, description } = album;
    await db.query(
      "UPDATE albums SET image=?, caption=?, description=? WHERE id=?",
      [image, caption, description, id]
    );
  }

  async delete(id) {
    await db.query("DELETE FROM albums WHERE id = ?", [id]);
  }
}

export default Gallery;
