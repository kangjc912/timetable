import express from 'express';
import { timeblocks } from '../../models/schedule.data.js'; // 2단계에서 만든 데이터

const router = express.Router();


router.get('/timeblocks', (req, res) => {
    res.json(timeblocks); 
});

export default router;