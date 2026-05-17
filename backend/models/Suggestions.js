import db from "../db.js";

class SuggestionModel {
  /**
   * Mengambil semua saran beserta nama user dari database
   * @returns {Promise<Array>} Array of suggestion objects
   */
  async findAll() {
    const [rows] = await db.query(`
      SELECT suggestions.id, suggestions.pesan, suggestions.created_at, users.name 
      FROM suggestions
      JOIN users ON suggestions.user_id = users.id
      ORDER BY suggestions.created_at DESC
    `);
    return rows;
  }

  /**
   * Mencari saran berdasarkan ID
   * @param {string} id 
   * @returns {Promise<Object>} Suggestion object
   */
  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM suggestions WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  /**
   * Membuat saran baru di database
   * @param {Object} data - Objek berisi id, user_id, pesan
   * @returns {Promise<Object>} Created suggestion object
   */
  async create(data) {
    const { id, user_id, pesan } = data;
    await db.query(
      `INSERT INTO suggestions 
      (id, user_id, pesan, created_at, updated_at) 
      VALUES (?, ?, ?, NOW(), NOW())`,
      [id, user_id, pesan]
    );

    return await this.findById(id);
  }

  /**
   * Menghapus saran dari database berdasarkan ID
   * @param {string} id 
   * @returns {Promise<any>}
   */
  async delete(id) {
    return await db.query("DELETE FROM suggestions WHERE id = ?", [
      id,
    ]);
  }
}

export default SuggestionModel;
