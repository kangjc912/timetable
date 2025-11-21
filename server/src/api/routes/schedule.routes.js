import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve(process.cwd(), 'src', 'models', 'timeblocks.data.json');











// 1. 목록 불러오기
router.get('/timeblocks', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) { res.status(500).json({ message: '로드 실패' }); }
});








// 2. 추가하기
router.post('/timeblocks', async (req, res) => {
    try {
        const rawData = await fs.readFile(dataPath, 'utf8');
        const timeblocks = JSON.parse(rawData);
        timeblocks.push(req.body);
        await fs.writeFile(dataPath, JSON.stringify(timeblocks, null, 4), 'utf8');
        res.json({ message: '추가됨', data: timeblocks });
    } catch (error) { res.status(500).json({ message: '추가 실패' }); }
});








// 3. 전체 삭제하기 (일괄 삭제)
router.delete('/timeblocks/all', async (req, res) => {
    try {

        await fs.writeFile(dataPath, '[]', 'utf8');
        res.json({ message: '모든 시간표가 삭제되었습니다.' });
    } catch (error) { res.status(500).json({ message: '초기화 실패' }); }
});







// 4. 하나만 삭제하기
router.delete('/timeblocks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await fs.readFile(dataPath, 'utf8');
        let timeblocks = JSON.parse(rawData);
        timeblocks = timeblocks.filter(block => block.id !== id);
        await fs.writeFile(dataPath, JSON.stringify(timeblocks, null, 4), 'utf8');
        res.json({ message: '삭제됨', data: timeblocks });
    } catch (error) { res.status(500).json({ message: '삭제 실패' }); }
});

export default router;