import express from 'express';
import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

//get all suggestions
router.get('/', async(req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM sugestions');
        res.json(results);
    } catch (error) {
        console.error('❌ Error fetching sugestions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async(req, res)=>{
    const [rows] = await db.query('SELECT * FROM sugestions WHERE sugestion_id = ?', [req.params.id]);
    if (!rows.length) {
        return res.status(404).json({ message: 'Data not found' });
    }
    res.json(rows[0]);
});

router.post('/', async(req, res)=>{
    try {
        const {user_id, pesan, created_at, updated_at} = req.body;
        const sugestion_id = uuidv4();
        await db.query('INSERT INTO sugestions (sugestion_id, user_id, pesan, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', 
        [sugestion_id, user_id, pesan, created_at, updated_at]);
        const [rows] = await db.query('SELECT * FROM sugestions WHERE sugestion_id = ?', [sugestion_id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('❌ Error creating sugestion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/:id', async(req, res)=>{
    try {
        const [rows] = await db.query('SELECT * FROM sugestions WHERE sugestion_id = ?', [req.params.id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Sugestion not found' });
        }
        await db.query('DELETE FROM sugestions WHERE sugestion_id = ?', [req.params.id]);
        res.json({ message: 'Sugestion deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting sugestion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

