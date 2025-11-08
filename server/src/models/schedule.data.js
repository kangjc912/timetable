// 각 시간표(Time Block)에 고유 ID를 부여하고, 필요한 조교 수를 정의
export const timeblocks = [
    // --- 평일 (월-금) ---
    { id: 'MON1', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'MON2', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'MON3', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'MON4', day: '월', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'MON5', day: '월', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'MON6', day: '월', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'MON7', day: '월', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },
    // ... (화, 수, 목, 금요일 데이터 추가) ...

    // --- 토요일 ---
    { id: 'SAT1', day: '토', startTime: '10:00', endTime: '12:00', teacher: 'B', requiredTAs: 1 },
    { id: 'SAT2', day: '토', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT3', day: '토', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT4', day: '토', startTime: '12:00', endTime: '14:00', teacher: '자기화', requiredTAs: 1 },
    // ... (나머지 토요일 데이터 추가) ...

    // --- 일요일 ---
    { id: 'SUN1', day: '일', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN2', day: '일', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN3', day: '일', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN4', day: '일', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },
];

// 조교 데이터 (초기 10명 가정)
export const tas = [
    { id: 'ta01', name: '김조교', contact: '010-1111-1111', availableTimes: [/* "월 17:00-22:00" */] },
    { id: 'ta02', name: '이조교', contact: '010-2222-2222', availableTimes: [/* "화 19:00-22:00" */] },
    // ... (조교 데이터) ...
];