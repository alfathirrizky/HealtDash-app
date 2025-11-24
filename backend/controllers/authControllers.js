import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  console.log("REQ BODY:", req.body);
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    console.log("STEP 1: Query user...");
    const [results] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    console.log("STEP 2: Hasil query:", results);

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = results[0];
    console.log("STEP 3: Bandingkan password...");

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("STEP 4: Hasil bcrypt:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.users_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log("STEP 5: Token dibuat ✅");
    return res.json({
      message: "Login berhasil",
      token,
      user: { 
        id: user.users_id, 
        email: user.email, 
        role: user.role, 
        name: user.name, 
        telepon: user.telepon, 
        position: user.position, 
        gender: user.gender, 
        profile: user.image
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
