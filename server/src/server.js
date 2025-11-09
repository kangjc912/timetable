import express from 'express';
import cors from 'cors';
import scheduleRoutes from './api/routes/schedule.routes.js'; // 3단계에서 만든 라우트

import taRoutes from './api/routes/ta.routes.js';
const app = express();
const PORT = process.env.PORT || 5000; // 5000번 포트 사용

// --- 미들웨어 설정 ---
app.use(cors()); // (필수) React 앱(보통 3000번)이 5000번 서버에 요청할 수 있게 허용
app.use(express.json()); // JSON 요청을 파싱

// --- API 라우트 연결 ---
app.use('/api/schedule', scheduleRoutes); // '/api/schedule'로 시작하는 요청은 scheduleRoutes가 처리


app.use('/api/tas', taRoutes); // '/api/tas'로 시작하는 요청은 taRoutes가 처리
// --- 서버 실행 ---
app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

