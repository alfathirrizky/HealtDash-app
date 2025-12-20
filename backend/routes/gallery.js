import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM albums");
    res.json(results);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET user by id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM albumss WHERE id = ?", [
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
    const id = uuidv4();
    const { image, caption, description} =
      req.body;
    const [result] = await db.query(
      "INSERT INTO users (id, image, caption, description) VALUES (?, ?, ?, ?)",
      [id, image, caption, description]
    );
    const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const { image, caption, description } =
      req.body;

    await db.query(
      "UPDATE users SET image = ?, caption = ?, description = ? WHERE id = ?",
      [image, caption, description, req.params.id]
    );

    const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [
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
    const [result] = await db.query("DELETE FROM albums WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Pictures not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
