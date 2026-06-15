import db from "./db.js";

async function check() {
  try {
    const [rows] = await db.query("SHOW COLUMNS FROM questions");
    console.log(rows);
  } catch (e) {
    console.error(e);
  }
  process.exit();
}

check();
