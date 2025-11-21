import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const dataPath = path.resolve(process.cwd(), 'src', 'models', 'timeblocks.data.json');

// 1. (GET) 목록 불러오기
router.get('/timeblocks', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '데이터 로드 실패' });
    }
});

// 2. (POST) 시간표 추가하기
router.post('/timeblocks', async (req, res) => {
    try {
        const rawData = await fs.readFile(dataPath, 'utf8');
        const timeblocks = JSON.parse(rawData);

        const newBlock = req.body;
        timeblocks.push(newBlock);

        await fs.writeFile(dataPath, JSON.stringify(timeblocks, null, 4), 'utf8');
        res.json({ message: '시간표가 추가되었습니다.', data: timeblocks });
    } catch (error) {
        res.status(500).json({ message: '추가 실패' });
    }
});

// 3. (DELETE) 시간표 삭제하기
router.delete('/timeblocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await fs.readFile(dataPath, 'utf8');
        let timeblocks = JSON.parse(rawData);

        // 해당 ID를 가진 블럭을 뺍니다.
        timeblocks = timeblocks.filter(block => block.id !== id);

        await fs.writeFile(dataPath, JSON.stringify(timeblocks, null, 4), 'utf8');
        res.json({ message: '삭제되었습니다.', data: timeblocks });
    } catch (error) {
        res.status(500).json({ message: '삭제 실패' });
    }
});

export default router;