import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";