import db from "../db.js";

class Suggestion {
    static async findAll() {
        const [rows] = await db.query(`
            SELECT sugestions.sugestion_id, sugestions.pesan, sugestions.created_at, users.name 
            FROM sugestions
            JOIN users ON sugestions.user_id = users.id
            ORDER BY sugestions.created_at DESC
        `);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
        "SELECT * FROM sugestions WHERE sugestion_id = ?",
        [id],
        );
        return rows[0];
    }

    static async create(data) {
        const { sugestion_id, user_id, pesan } = data;

        await db.query(
        `INSERT INTO sugestions 
        (sugestion_id, user_id, pesan, created_at, updated_at) 
        VALUES (?, ?, ?, NOW(), NOW())`,
        [sugestion_id, user_id, pesan],
        );

    return await this.findById(sugestion_id);
    }

    static async delete(id) {
        return await db.query("DELETE FROM sugestions WHERE sugestion_id = ?", [
        id,
        ]);
    }
}

export default Suggestion;
