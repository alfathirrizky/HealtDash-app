import { sendFileToPython } from "../services/pythonServices.js";
import IdentifiedEmployee from "../models/IdentifiedEmployee.js";

const employeeModel = new IdentifiedEmployee();

export const uploadExcel = async (req, res) => {
    try {
        const filePath = req.file.path;
        const result = await sendFileToPython(filePath);

        // Simpan hasil identifikasi ke database MySQL
        if (result && result.hr_recommendations) {
            for (const rec of result.hr_recommendations) {
                await employeeModel.create({
                    employee_name: rec.employee_name,
                    stress_level: rec.stress_level,
                    work_hours: rec.work_hours,
                    sleep_quality: rec.sleep_quality,
                    risk_score: rec.risk_score,
                    risk_level: rec.risk_level,
                    dominant_factor: rec.dominant_factor
                });
            }
        }

        res.json(result);
    } catch (error) {
        console.error("Error uploadExcel:", error.message);
        res.status(500).json({ error: "Gagal memproses file" });
    }
};
