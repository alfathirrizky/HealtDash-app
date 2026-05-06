import db from "../db.js";

class Suggestion {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT suggestions.sugestion_id, suggestions.pesan, suggestions.created_at, users.name 
            FROM suggestions
            JOIN users ON suggestions.user_id = users.id
            ORDER BY suggestions.created_at DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
        "SELECT * FROM suggestions WHERE sugestion_id = ?",
        [id],
        );
        return rows[0];
    }

    static async create(data) {
        const { sugestion_id, user_id, pesan } = data;

        await db.query(
        `INSERT INTO suggestions 
        (sugestion_id, user_id, pesan, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())`,
        [sugestion_id, user_id, pesan],
        );

    return await this.findById(sugestion_id);
    }

    static async delete(id) {
        return await db.query("DELETE FROM suggestions WHERE sugestion_id = ?", [
        id,
        ]);
    }
}

export default Suggestion;
