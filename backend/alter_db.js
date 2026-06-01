import db from "./db.js";
async function alter() {
  try {
    await db.query("ALTER TABLE surveys ADD COLUMN category VARCHAR(255) DEFAULT 'Umum'");
    console.log("Column added");
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists");
    } else {
      console.error(e);
    }
  }
  process.exit();
}
alter();
