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

// 📂 pastikan folder uploads ada
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//GET ALL ALBUMS
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM albums");
  res.json(rows);
});

//GET BY ID
router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [
    req.params.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(rows[0]);
});

//CREATE WITHOUT IMAGE UPLOAD
router.post("/", async (req, res) => {
  try {
    const { caption, description, image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }
    const id = uuidv4();
    await db.query(
      "INSERT INTO albums (id, image, caption, description) VALUES (?, ?, ?, ?)",
      [id, image, caption, description]
    );
    const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [id]);
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
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { caption, description } = req.body;

    const [rows] = await db.query("SELECT * FROM albums WHERE id=?", [
      req.params.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: "Data not found" });
    }

    let filename = rows[0].image;

    if (req.file) {
      const oldPath = path.join(uploadDir, filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      filename = req.file.filename;
    }

    await db.query(
      "UPDATE albums SET image=?, caption=?, description=? WHERE id=?",
      [filename, caption, description, req.params.id]
    );

    const [updated] = await db.query("SELECT * FROM albums WHERE id=?", [
      req.params.id,
    ]);

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM albums WHERE id = ?", [
    req.params.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ message: "Data not found" });
  }
  const filePath = path.join(uploadDir, rows[0].image);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await db.query("DELETE FROM albums WHERE id = ?", [req.params.id]);
  res.json({ message: "Deleted successfully" });
});

router.use((err, req, res, next) => {
  if (err.message === "ONLY_JPG_PNG") {
    return res.status(400).send("ONLY_JPG_PNG");
  }
  res.status(500).send("UPLOAD_ERROR");
});

export default router;
