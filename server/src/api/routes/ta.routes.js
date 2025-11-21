import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve(process.cwd(), 'src', 'models', 'tas.data.json');

// 1. 목록 불러오기
router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) { res.status(500).json({ message: '로드 실패' }); }
});







// 2. 추가하기
router.post('/', async (req, res) => {
    try {
        const rawData = await fs.readFile(dataPath, 'utf8');
        const tas = JSON.parse(rawData);
        tas.push(req.body);
        await fs.writeFile(dataPath, JSON.stringify(tas, null, 4), 'utf8');
        res.json({ message: '추가됨', data: tas });
    } catch (error) { res.status(500).json({ message: '추가 실패' }); }
});









// 3. 전체 삭제하기 (일괄 삭제)
router.delete('/all', async (req, res) => {
    try {
        await fs.writeFile(dataPath, '[]', 'utf8');
        res.json({ message: '모든 조교 데이터가 삭제되었습니다.' });
    } catch (error) { res.status(500).json({ message: '초기화 실패' }); }
});








// 4. 하나만 삭제하기
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await fs.readFile(dataPath, 'utf8');
        let tas = JSON.parse(rawData);
        tas = tas.filter(ta => ta.id !== id);
        await fs.writeFile(dataPath, JSON.stringify(tas, null, 4), 'utf8');
        res.json({ message: '삭제됨', data: tas });
    } catch (error) { res.status(500).json({ message: '삭제 실패' }); }
});

export default router;