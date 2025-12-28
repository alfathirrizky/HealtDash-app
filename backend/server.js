import express from "express";
import db from "./db.js";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import questionRoutes from "./routes/question.js";
import userRoutes from "./routes/user.js";
import answerRoutes from "./routes/answer.js";
import { PORT } from "./config/index.js";
import authRoutes from "./routes/auth.js";
import galleryRoutes from "./routes/gallery.js";
import dotenv from "dotenv";
import surveyRoutes from "./routes/survey.js";
import path from "path";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
// Middleware agar bisa membaca JSON dari body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files untuk mengakses gambar yang diupload
app.use("/uploads", express.static(path.resolve("uploads")));

// Cek server
app.get("/", (req, res) => {
  res.json({ message: "API berjalan 🚀" });
});

//routes
app.use("/api", uploadRoutes);
// Semua endpoint question diawali /questions
app.use("/api/questions", questionRoutes);
// Semua endpoint user diawali /users
app.use("/api/users", userRoutes);
// Semua endpoint answers diawali /answers
app.use("/api/answers", answerRoutes);
// Semua endpoint auth diawali /auth
app.use("/api/auth", authRoutes);
// Semua endpoint gallery diawali /gallery
app.use("/api/gallery", galleryRoutes);
// Semua endpoint surveys diawali /surveys
app.use("/api/surveys", surveyRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
