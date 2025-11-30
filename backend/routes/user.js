import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET user by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE users_id = ?", [
      req.params.id,
    ]);

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const { image, telepon, name, email, position, gender, password } =
      req.body;

    const [result] = await db.query(
      "INSERT INTO users (image, telepon, name, email, position, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [image, telepon, name, email, position, gender, password]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE users_id = ?", [
      result.insertId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const { image, telepon, name, email, position, gender, password } =
      req.body;

    await db.query(
      "UPDATE users SET image = ?, telepon = ?, name = ?, email = ?, position = ?, gender = ?, password = ? WHERE users_id = ?",
      [image, telepon, name, email, position, gender, password, req.params.id]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE users_id = ?", [
      req.params.id,
    ]);

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE users_id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
