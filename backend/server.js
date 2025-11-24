import express from "express";
import db from "./db.js";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import questionRoutes from "./routes/question.js";
import userRoutes from "./routes/user.js";
import answerRoutes from "./routes/answer.js";
import { PORT } from "./config/index.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cek server
app.get("/", (req, res) => {
  res.json({ message: "API berjalan 🚀" });
});

//routes
app.use("/api", uploadRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/auth", authRoutes);


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
