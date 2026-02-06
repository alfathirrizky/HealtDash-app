import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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
    const { image, telepon, name, email, position, gender, password } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }
    const id = uuidv4();
    await db.query(
      "INSERT INTO users (image, telepon, name, email, position, gender, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [image, telepon, name, email, position, gender, password, role],
    );
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
});

//CREATE (UPLOAD IMAGE)
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("NO_FILE");
  }
  res.status(200).send(req.file.filename);
});

//UPDATE (REPLACE IMAGE)
router.put("/:id", async (req, res) => {
  try {
    const { image, telepon, name, email, position, gender, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (!rows.length) {
      return res.status(404).json({ message: "Data users not found" });
    }
    let filename = rows[0].image;
    // ganti image hanya jika dikirim
    if (image) {
      const oldPath = path.join(uploadDir, filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      filename = image;
    }
    await db.query(
      "UPDATE users SET image=?, telepon=?, name=?, email=?, position=?, gender=?, password=? WHERE id=?",
      [filename, telepon, name, email, position, gender, password, req.params.id]
    );
    const [updated] = await db.query("SELECT * FROM users WHERE id=?", [
      req.params.id,
    ]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
    req.params.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ message: "Data users not found" });
  }
  const filePath = path.join(uploadDir, rows[0].image);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "Deleted successfully" });
});

router.use((err, req, res, next) => {
  if (err.message === "ONLY_JPG_PNG") {
    return res.status(400).send("ONLY_JPG_PNG");
  }
  res.status(500).send("UPLOAD_ERROR");
});

export default router;
