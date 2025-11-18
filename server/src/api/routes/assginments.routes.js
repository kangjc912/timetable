import express from 'express';
import fs from 'fs/promises'; 
import path from 'path';

const router = express.Router();


const dataPath = path.resolve(process.cwd(), 'src', 'models', 'assignments.data.json');


router.get('/', async (req, res) => {
    try {

        const data = await fs.readFile(dataPath, 'utf8');

        res.json(JSON.parse(data));
    } catch (error) {

        console.error('불러오기 실패:', error);
        res.json({}); 
    }
});


router.post('/', async (req, res) => {
    try {

        const newAssignments = req.body;
        

        const data = JSON.stringify(newAssignments, null, 4);


        await fs.writeFile(dataPath, data, 'utf8');
        

        res.status(200).json({ message: '성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('저장하기 실패:', error);
        res.status(500).json({ message: '저장에 실패했습니다.' });
    }
});

export default router;