import express from 'express';
import db from '../db.js';

const router = express.Router();

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

export default router;