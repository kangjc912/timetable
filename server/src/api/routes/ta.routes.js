import express from 'express';
import { tas } from '../../models/tas.data.js'; // 2단계에서 만든 데이터

const router = express.Router();

router.get('/', (req, res) => {
    res.json(tas); 
});

export default router;