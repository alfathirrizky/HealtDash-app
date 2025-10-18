import { sendFileToPython } from "../services/pythonServices.js";

export const uploadExcel = async (req, res) => {
    try {
        const filePath = req.file.path;
        const result = await sendFileToPython(filePath);
        res.json(result);
    } catch (error) {
        console.error("Error uploadExcel:", error.message);
        res.status(500).json({ error: "Gagal memproses file" });
    }
};
