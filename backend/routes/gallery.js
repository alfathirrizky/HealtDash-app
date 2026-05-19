import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import Gallery from "../models/Gallery.js";
import GalleryService from "../services/GalleryService.js";
import GalleryController from "../controllers/GalleryController.js";

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
      cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});

// OOP Instantiation
const galleryModel = new Gallery();
const galleryService = new GalleryService(galleryModel);
const galleryController = new GalleryController(galleryService);

// Routes
router.get("/", galleryController.getAll);
router.get("/:id", galleryController.getById);
router.post("/", galleryController.create);
router.put("/:id", galleryController.update);
router.delete("/:id", galleryController.delete);

//CREATE (UPLOAD IMAGE)
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("NO_FILE");
  }
  res.status(200).send(req.file.filename);
});

router.use((err, req, res, next) => {
  if (err.message === "ONLY_JPG_PNG" || err.message === "Invalid file type") {
    return res.status(400).send("ONLY_JPG_PNG");
  }
  res.status(500).send("UPLOAD_ERROR");
});

export default router;
