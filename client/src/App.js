import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Timetable from './components/Timetable';
import Dashboard from './components/Dashboard';

// --- 헬퍼 함수들 ---

const checkConsecutive = (taId, newBlock, currentAssignments, allTimeblocks) => {
    const parseTime = (t) => parseInt(t.replace(':', ''), 10);
    const assignedBlockIds = Object.keys(currentAssignments).filter(blockId =>
        currentAssignments[blockId].includes(taId)
    );
    const dayBlocks = [...assignedBlockIds, newBlock.id]
        .map(id => allTimeblocks.find(b => b.id === id))
        .filter(b => b && b.day === newBlock.day);
    const uniqueBlocks = [...new Set(dayBlocks)];
    uniqueBlocks.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

    let streak = 1;
    for (let i = 0; i < uniqueBlocks.length - 1; i++) {
        const current = uniqueBlocks[i];
        const next = uniqueBlocks[i + 1];
        if (parseTime(current.endTime) === parseTime(next.startTime)) streak++;
        else streak = 1;
        if (streak >= 3) return false;
    }
    return true;
};

const checkOverlap = (blockA, blockB) => {
    if (blockA.day !== blockB.day) return false;
    if (blockA.id === blockB.id) return false;
    const parseTime = (t) => parseInt(t.replace(':', ''), 10);
    return parseTime(blockA.startTime) < parseTime(blockB.endTime) && parseTime(blockA.endTime) > parseTime(blockB.startTime);
};

function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [tas, setTas] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);

    // [시간표] 입력값 State
    const [newBlock, setNewBlock] = useState({
        day: '월', startTime: '12:00', endTime: '14:00', teacher: '', requiredTAs: 1
    });

    // [조교] 입력값 State (NEW!)
    const [newTA, setNewTA] = useState({ name: '', contact: '', availableDays: [], minTime: '00:00', maxTime: '23:59' });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [timeblocksRes, tasRes, assignmentsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/schedule/timeblocks'),
                    axios.get('http://localhost:5000/api/tas'),
                    axios.get('http://localhost:5000/api/assignments')
                ]);
                setTimeblocks(timeblocksRes.data);
                setTas(tasRes.data);
                setAssignments(assignmentsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- 핸들러 모음 ---

    const handleAssign = (timeblockId, taId, isChecked) => {
        const currentTAs = assignments[timeblockId] || [];
        if (isChecked) {
            if (currentTAs.length >= 2) { alert("최대 2명까지만 배정 가능합니다."); return; }
            const currentBlock = timeblocks.find(b => b.id === timeblockId);
            if (!checkConsecutive(taId, currentBlock, assignments, timeblocks)) { alert("3연강 불가!"); return; }
            setAssignments({ ...assignments, [timeblockId]: [...currentTAs, taId] });
        } else {
            setAssignments({ ...assignments, [timeblockId]: currentTAs.filter(id => id !== taId) });
        }
    };







    const handleSave = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/assignments', assignments);
            alert(res.data.message);
        } catch (err) { alert('저장 실패'); }
    };







    const handleReset = () => {
        if (window.confirm("정말로 초기화하시겠습니까?")) setAssignments({});
    };








    const handleAutoAssign = () => {
        let nextAssignments = { ...assignments };
        const MAX_WORKLOAD = 4;
        const getWorkload = (taId) => Object.values(nextAssignments).flat().filter(id => id === taId).length;
        const isCandidateValid = (ta, block, currentAssigned) => {
            if (!ta.availableBlockIds.includes(block.id)) return false;
            if (currentAssigned.includes(ta.id)) return false;
            for (const [bid, tids] of Object.entries(nextAssignments)) {
                if (tids.includes(ta.id)) {
                    const other = timeblocks.find(b => b.id === bid);
                    if (other && checkOverlap(block, other)) return false;
                }
            }
            return checkConsecutive(ta.id, block, nextAssignments, timeblocks);
        };

        timeblocks.forEach(block => { // 1단계
            const req = block.requiredTAs || 1;
            const cands = tas.filter(ta => isCandidateValid(ta, block, nextAssignments[block.id] || []));
            if (cands.length <= req) {
                if (!nextAssignments[block.id]) nextAssignments[block.id] = [];
                cands.forEach(ta => { if (!nextAssignments[block.id].includes(ta.id)) nextAssignments[block.id].push(ta.id); });
            }
        });

        timeblocks.filter(b => (nextAssignments[b.id] || []).length < (b.requiredTAs || 1)).forEach(block => { // 2단계
            const curr = nextAssignments[block.id] || [];
            const needed = (block.requiredTAs || 1) - curr.length;
            let cands = tas.filter(ta => isCandidateValid(ta, block, curr) && getWorkload(ta.id) < MAX_WORKLOAD);
            cands.sort((a, b) => getWorkload(a.id) - getWorkload(b.id));
            for (let i = 0; i < needed; i++) {
                if (cands[i]) {
                    if (!nextAssignments[block.id]) nextAssignments[block.id] = [];
                    nextAssignments[block.id].push(cands[i].id);
                }
            }
        });
        setAssignments(nextAssignments);
        alert(`🤖 배정 완료!`);
    };









    const handleDeleteBlock = async (blockId) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/schedule/timeblocks/${blockId}`);
            setTimeblocks(prev => prev.filter(b => b.id !== blockId));
            const newAssignments = { ...assignments };
            delete newAssignments[blockId];
            setAssignments(newAssignments);
            alert("삭제되었습니다.");
        } catch (err) { alert("삭제 실패"); }
    };







    // [시간표] 추가 관련
    const handleInputChange = (e) => setNewBlock({ ...newBlock, [e.target.name]: e.target.value });






    const handleAddBlock = async () => {
        if (!newBlock.teacher) { alert("선생님 이름을 입력하세요"); return; }
        const blockToAdd = { ...newBlock, id: `NEW_${Date.now()}` };
        try {
            await axios.post('http://localhost:5000/api/schedule/timeblocks', blockToAdd);
            setTimeblocks([...timeblocks, blockToAdd]);
            alert("수업 추가됨!");
        } catch (err) { alert("추가 실패"); }
    };





    // [조교] 추가 관련 (NEW!)
    const handleTAInputChange = (e) => setNewTA({ ...newTA, [e.target.name]: e.target.value });







    const handleTADayChange = (day) => {
        if (newTA.availableDays.includes(day)) {
            // 이미 있으면 뺌 (체크 해제)
            setNewTA({ ...newTA, availableDays: newTA.availableDays.filter(d => d !== day) });
        } else {
            // 없으면 넣음 (체크)
            setNewTA({ ...newTA, availableDays: [...newTA.availableDays, day] });
        }
    };








    const handleAddTA = async () => {
        if (!newTA.name) { alert("조교 이름을 입력하세요"); return; }
        if (newTA.availableDays.length === 0) { alert("근무 가능한 요일을 선택하세요"); return; }

        // 1. 시간 문자열을 숫자로 바꾸는 헬퍼 (예: "19:00" -> 1900)
        const parse = (t) => parseInt(t.replace(':', ''), 10);
        const limitStart = parse(newTA.minTime);
        const limitEnd = parse(newTA.maxTime);

        // 2. 요일 AND 시간 조건이 모두 맞는 수업만 골라내기
        const selectedBlockIds = timeblocks
            .filter(block => {
                // (1) 요일이 맞아야 함
                const dayMatch = newTA.availableDays.includes(block.day);

                // (2) 시간이 범위 안에 있어야 함
                // 수업 시작시간 >= 조교 출근가능시간  AND  수업 종료시간 <= 조교 퇴근가능시간
                const blockStart = parse(block.startTime);
                const blockEnd = parse(block.endTime);
                const timeMatch = (blockStart >= limitStart) && (blockEnd <= limitEnd);

                return dayMatch && timeMatch;
            })
            .map(block => block.id);

        if (selectedBlockIds.length === 0) {
            if (!window.confirm("선택한 요일과 시간대에 맞는 수업이 하나도 없습니다. 그래도 등록하시겠습니까?")) return;
        }

        const taToAdd = {
            ...newTA,
            id: `TA_${Date.now()}`,
            availableBlockIds: selectedBlockIds
        };

        try {
            await axios.post('http://localhost:5000/api/tas', taToAdd);
            setTas([...tas, taToAdd]);
            // 초기화
            setNewTA({ name: '', contact: '', availableDays: [], minTime: '00:00', maxTime: '23:59' });
            alert(`${newTA.name} 조교 추가 완료! (총 ${selectedBlockIds.length}개 수업 가능)`);
        } catch (err) { alert("추가 실패"); }
    };






    const handleClearAllBlocks = async () => {
        if (!window.confirm("⚠️ 경고: 모든 수업 시간표가 삭제됩니다!\n(배정된 내용도 함께 사라집니다)\n정말 진행하시겠습니까?")) return;
        try {
            await axios.delete('http://localhost:5000/api/schedule/timeblocks/all');
            setTimeblocks([]); // 화면 비우기
            setAssignments({}); // 배정 내역도 초기화
            alert("시간표가 모두 삭제되었습니다.");
        } catch (err) { alert("삭제 실패"); }
    };




    // [조교] 일괄 삭제
    const handleClearAllTAs = async () => {
        if (!window.confirm("⚠️ 경고: 모든 조교 데이터가 삭제됩니다!\n(배정된 내용도 함께 사라집니다)\n정말 진행하시겠습니까?")) return;
        try {
            await axios.delete('http://localhost:5000/api/tas/all');
            setTas([]); // 화면 비우기
            setAssignments({}); // 배정 내역도 초기화
            alert("조교 리스트가 모두 삭제되었습니다.");
        } catch (err) { alert("삭제 실패"); }
    };





    // [조교] 삭제 관련 (NEW!)
    const handleDeleteTA = async (taId) => {
        if (!window.confirm("정말로 이 조교를 삭제하시겠습니까? (배정된 내용도 사라집니다)")) return;
        try {
            await axios.delete(`http://localhost:5000/api/tas/${taId}`);
            setTas(prev => prev.filter(t => t.id !== taId));

            // 배정된 내역에서도 삭제
            const newAssignments = { ...assignments };
            Object.keys(newAssignments).forEach(blockId => {
                newAssignments[blockId] = newAssignments[blockId].filter(id => id !== taId);
            });
            setAssignments(newAssignments);
            alert("삭제되었습니다.");
        } catch (err) { alert("삭제 실패"); }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Timeblocks Admin</h1>

                <div className="button-group">
                    <button onClick={handleSave} className="save-button">💾 저장하기</button>
                    <button onClick={handleAutoAssign} className="auto-button">🤖 자동 배정</button>
                    <button onClick={handleReset} className="reset-button">🧹 초기화</button>
                </div>

                {/* 입력 폼 그룹 */}
                <div className="forms-container">
                    {/* 수업 추가 폼 */}
                    <div className="add-block-form">
                        <h3>➕ 수업 추가</h3>
                        <button onClick={handleClearAllBlocks} className="danger-btn-small">🗑️ 시간표 전체 삭제</button>
                        <div className="form-row">
                            <select name="day" value={newBlock.day} onChange={handleInputChange}>
                                {['월', '화', '수', '목', '금', '토', '일'].map(d => <option key={d} value={d}>{d}요일</option>)}
                            </select>

                            <input type="time" name="startTime" value={newBlock.startTime} onChange={handleInputChange} />
                            <span>~</span>
                            <input type="time" name="endTime" value={newBlock.endTime} onChange={handleInputChange} />


                            <input
                                type="text"
                                name="teacher"
                                list="teacherOptions"
                                placeholder="선생님 선택/입력"
                                value={newBlock.teacher}
                                onChange={handleInputChange}
                                style={{ width: '120px' }}
                            />
                            {/* 미리 정의된 선생님 목록 */}
                            <datalist id="teacherOptions">
                                <option value="A" />
                                <option value="B" />
                                <option value="C" />
                                <option value="자기화" />
                            </datalist>


                            <button onClick={handleAddBlock}>추가</button>
                        </div>
                    </div>




                    <div className="add-block-form" style={{ borderColor: '#28a745' }}>
                        <h3 style={{ color: '#28a745' }}>👤 조교 추가</h3>
                        <button onClick={handleClearAllTAs} className="danger-btn-small">🗑️ 조교 전체 삭제</button>
                        <div className="form-row">
                            <input type="text" name="name" placeholder="이름 (예: 김신입)" value={newTA.name} onChange={handleTAInputChange} />
                            <input type="text" name="contact" placeholder="연락처" value={newTA.contact} onChange={handleTAInputChange} />
                            <button onClick={handleAddTA} style={{ backgroundColor: '#17a2b8' }}>등록</button>
                        </div>



                        <div className="form-row" style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            <span>🕒 근무 가능 시간: </span>
                            <input
                                type="time"
                                name="minTime"
                                value={newTA.minTime}
                                onChange={handleTAInputChange}
                                style={{ padding: '5px' }}
                            />
                            <span> 부터 </span>
                            <input
                                type="time"
                                name="maxTime"
                                value={newTA.maxTime}
                                onChange={handleTAInputChange}
                                style={{ padding: '5px' }}
                            />
                            <span> 까지</span>
                        </div>



                        <div className="day-checkboxes">
                            <span>가능 요일: </span>
                            {['월', '화', '수', '목', '금', '토', '일'].map(day => (
                                <label key={day} style={{ marginRight: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={newTA.availableDays.includes(day)}
                                        onChange={() => handleTADayChange(day)}
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>


                    </div>
                </div>

            </header>
            <main>
                <Timetable
                    timeblocks={timeblocks}
                    tas={tas}
                    assignments={assignments}
                    onAssign={handleAssign}
                    onDeleteBlock={handleDeleteBlock}
                />
                <Dashboard tas={tas} assignments={assignments} />

                {/* 조교 관리 리스트 (삭제용) */}
                <div className="ta-manage-list">
                    <h3>📋 조교 목록 관리</h3>
                    <ul>
                        {tas.map(ta => (
                            <li key={ta.id}>
                                <span>{ta.name} ({ta.contact})</span>
                                <button onClick={() => handleDeleteTA(ta.id)} className="delete-ta-btn">삭제 ❌</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;