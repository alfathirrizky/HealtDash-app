import express from "express";
import db from "../db.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

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
            return cb(new Error("Invalid file type"));
        }
        cb(null, true);
    },
});

//get all surveys
router.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM surveys");
        res.json(results);
    } catch (error) {
        console.error("❌ Error fetching surveys:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    const [rows] = await db.query("SELECT * FROM surveys WHERE id = ?", [
        req.params.id,
    ]);
    if (!rows.length) {
        return res.status(404).json({ message: "Data not found" });
    }
    res.json(rows[0]);
});

router.post("/", async (req, res) => {
    try {
        const { image, title, caption, description, is_active } = req.body;
        if (!image) {
        return res.status(400).json({ message: "Image required" });
        }
        const id = uuidv4();
        await db.query(
            "INSERT INTO surveys (id, image, title, caption, description, is_active) VALUES (?, ?, ?, ?, ?, ?)",
            [id, image, title, caption, description, is_active]
        );
        const [rows] = await db.query("SELECT * FROM surveys WHERE id = ?", [id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Create Survey Error:", error);
        res.status(500).json({ error: "Created failed" });
    }
});

router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("NO_FILE");
    }
    res.status(200).send(req.file.filename);
});

export default router;
