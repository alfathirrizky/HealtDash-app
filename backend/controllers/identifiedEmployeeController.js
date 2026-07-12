import IdentifiedEmployee from "../models/IdentifiedEmployee.js";
import db from "../db.js";

const employeeModel = new IdentifiedEmployee();

export const getIdentifiedEmployees = async (req, res) => {
    try {
        const data = await employeeModel.findAll();
        res.json(data);
    } catch (error) {
        console.error("Error getIdentifiedEmployees:", error.message);
        res.status(500).json({ error: "Gagal mengambil data karyawan teridentifikasi" });
    }
};

export const deleteIdentifiedEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await employeeModel.delete(id);
        res.json({ message: "Data karyawan teridentifikasi berhasil dihapus" });
    } catch (error) {
        console.error("Error deleteIdentifiedEmployee:", error.message);
        res.status(500).json({ error: "Gagal menghapus data karyawan" });
    }
};

export const getStressFactors = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          'stress_level' AS category,
          COALESCE(ROUND(AVG(stress_level), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
        UNION ALL
        SELECT 
          'work_hours' AS category,
          COALESCE(ROUND(AVG(work_hours), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
        UNION ALL
        SELECT 
          'sleep_quality' AS category,
          COALESCE(ROUND(AVG(sleep_quality), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
      `);
      
      // Sort rows by avg_score DESC
      rows.sort((a, b) => parseFloat(b.avg_score) - parseFloat(a.avg_score));
      res.json(rows);
    } catch (error) {
      console.error("❌ Error fetching stress factors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getStressFactorsBySurvey = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          'stress_level' AS category,
          COALESCE(ROUND(AVG(stress_level), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
        UNION ALL
        SELECT 
          'work_hours' AS category,
          COALESCE(ROUND(AVG(work_hours), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
        UNION ALL
        SELECT 
          'sleep_quality' AS category,
          COALESCE(ROUND(AVG(sleep_quality), 2), 0.00) AS avg_score,
          COUNT(DISTINCT id) AS total_respondents,
          COUNT(id) AS total_responses
        FROM identified_employees
      `);
      
      rows.sort((a, b) => parseFloat(b.avg_score) - parseFloat(a.avg_score));
      res.json(rows);
    } catch (error) {
      console.error("❌ Error fetching stress factors by survey:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
