import db from "../db.js";

class Suggestion {
    static async getAll() {
        const [rows] = await db.query("SELECT * FROM suggestions");
        return rows;
    }

    static async bulkInsert(values) {
        return await db.query(
        "INSERT INTO suggestions (id, user_id, pesan) VALUES ?",
        [values],
        );
    }
}

export default Suggestion;
