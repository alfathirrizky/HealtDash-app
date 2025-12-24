import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    // Query mengambil semua data user
    const [results] = await db.query("SELECT * FROM users");
    // Kirim data ke client dalam format JSON
    res.json(results);
  } catch (error) {
    // Log error di server untuk debugging
    console.error("Error fetching users:", error);
    // Response error ke client
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET user by id
router.get("/:id", async (req, res) => {
  try {
    // Query berdasarkan parameter id dari URL
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    // Jika data tidak ditemukan
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    // Kirim data user
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    // Generate ID unik menggunakan UUID
    const id = uuidv4();
    // Ambil data dari request body
    const { image, telepon, name, email, position, gender, password } =
      req.body;
    // Insert data ke database
    const [result] = await db.query(
      "INSERT INTO users (id, image, telepon, name, email, position, gender, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, image, telepon, name, email, position, gender, password]
    );
    // Ambil kembali data user yang baru dibuat
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    // Kirim response dengan status CREATED
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    // Ambil data dari body request
    const { image, telepon, name, email, position, gender, password } =
      req.body;
    // Update data user berdasarkan ID
    await db.query(
      "UPDATE users SET image = ?, telepon = ?, name = ?, email = ?, position = ?, gender = ?, password = ? WHERE id = ?",
      [image, telepon, name, email, position, gender, password, req.params.id]
    );
    // Ambil kembali data yang sudah diupdate
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    // Jika user tidak ditemukan
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    // Kirim data user terbaru
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    // Hapus data user berdasarkan ID
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [
      req.params.id,
    ]);
    // Jika tidak ada data yang terhapus
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    // Response sukses
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Export router agar bisa digunakan di app.js
export default router;
