import { sendFileToPython } from "../services/pythonServices.js";
import db from "../db.js";

export const uploadExcel = async (req, res) => {
    try {
        const filePath = req.file.path;
        const result = await sendFileToPython(filePath);

        // Langsung kembalikan hasil tanpa menyimpan ke database
        res.json(result);
    } catch (error) {
        console.error("Error uploadExcel:", error.message);
        res.status(500).json({ error: "Gagal memproses file" });
    }
};
