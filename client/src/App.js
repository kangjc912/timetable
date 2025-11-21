import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Timetable from './components/Timetable';
import Dashboard from './components/Dashboard';

// --- 헬퍼 함수들 (컴포넌트 밖) ---

// 3연강 여부 검사
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
        if (parseTime(current.endTime) === parseTime(next.startTime)) {
            streak++;
        } else {
            streak = 1;
        }
        if (streak >= 3) return false;
    }
    return true;
};

// 시간 겹침 확인 (StartA < EndB && EndA > StartB)
const checkOverlap = (blockA, blockB) => {
    if (blockA.day !== blockB.day) return false;
    if (blockA.id === blockB.id) return false;

    const parseTime = (t) => parseInt(t.replace(':', ''), 10);
    const startA = parseTime(blockA.startTime);
    const endA = parseTime(blockA.endTime);
    const startB = parseTime(blockB.startTime);
    const endB = parseTime(blockB.endTime);

    return startA < endB && endA > startB;
};


function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [tas, setTas] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);

    // [추가 기능] 새 시간표 입력값 State
    const [newBlock, setNewBlock] = useState({
        day: '월',
        startTime: '12:00',
        endTime: '14:00',
        teacher: '',
        requiredTAs: 1
    });

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

    // 수동 배정 핸들러
    const handleAssign = (timeblockId, taId, isChecked) => {
        const currentTAs = assignments[timeblockId] || [];
        let newTAs = [];

        if (isChecked) {
            if (currentTAs.length >= 2) {
                alert("이 시간표에는 최대 2명까지만 배정할 수 있습니다.");
                return;
            }
            const currentBlock = timeblocks.find(b => b.id === timeblockId);
            if (!checkConsecutive(taId, currentBlock, assignments, timeblocks)) {
                alert("해당 조교는 3타임 연속(3연강)으로 배정할 수 없습니다.");
                return;
            }
            newTAs = [...currentTAs, taId];
        } else {
            newTAs = currentTAs.filter(id => id !== taId);
        }

        const newAssignments = { ...assignments, [timeblockId]: newTAs };
        setAssignments(newAssignments);
    };

    // 저장 핸들러
    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/assignments', assignments);
            alert(response.data.message);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        }
    };

    // 초기화 핸들러
    const handleReset = () => {
        if (window.confirm("정말로 모든 배정 내용을 지우시겠습니까?")) {
            setAssignments({});
        }
    };

    // 🤖 자동 배정 핸들러 (2단계 로직)
    const handleAutoAssign = () => {
        let nextAssignments = { ...assignments };
        const MAX_WORKLOAD = 4;

        const getWorkload = (taId) => Object.values(nextAssignments).flat().filter(id => id === taId).length;

        const isCandidateValid = (ta, block, currentAssigned) => {
            if (!ta.availableBlockIds.includes(block.id)) return false;
            if (currentAssigned.includes(ta.id)) return false;
            for (const [assignedBlockId, assignedTaIds] of Object.entries(nextAssignments)) {
                if (assignedTaIds.includes(ta.id)) {
                    const otherBlock = timeblocks.find(b => b.id === assignedBlockId);
                    if (otherBlock && checkOverlap(block, otherBlock)) return false;
                }
            }
            if (!checkConsecutive(ta.id, block, nextAssignments, timeblocks)) return false;
            return true;
        };

        // 1단계: 필수 배정 (후보 부족한 곳)
        timeblocks.forEach(block => {
            const requiredCount = block.requiredTAs || 1;
            const validCandidates = tas.filter(ta => {
                const current = nextAssignments[block.id] || [];
                return isCandidateValid(ta, block, current);
            });

            if (validCandidates.length <= requiredCount) {
                if (!nextAssignments[block.id]) nextAssignments[block.id] = [];
                validCandidates.forEach(ta => {
                    if (!nextAssignments[block.id].includes(ta.id)) {
                        nextAssignments[block.id].push(ta.id);
                    }
                });
            }
        });

        // 2단계: 균형 배정
        const remainingBlocks = timeblocks.filter(block => {
            const current = nextAssignments[block.id] || [];
            return current.length < (block.requiredTAs || 1);
        });

        remainingBlocks.forEach(block => {
            const currentAssigned = nextAssignments[block.id] || [];
            const requiredCount = block.requiredTAs || 1;
            const needed = requiredCount - currentAssigned.length;

            let candidates = tas.filter(ta => {
                if (!isCandidateValid(ta, block, currentAssigned)) return false;
                if (getWorkload(ta.id) >= MAX_WORKLOAD) return false;
                return true;
            });

            candidates.sort((a, b) => getWorkload(a.id) - getWorkload(b.id));

            for (let i = 0; i < needed; i++) {
                if (candidates[i]) {
                    if (!nextAssignments[block.id]) nextAssignments[block.id] = [];
                    nextAssignments[block.id].push(candidates[i].id);
                }
            }
        });

        setAssignments(nextAssignments);
        const totalAssigned = Object.values(nextAssignments).flat().length;
        alert(`🤖 배정 완료! (총 ${totalAssigned}건)`);
    };

    // 🗑️ 시간표 삭제 핸들러
    const handleDeleteBlock = async (blockId) => {
        if (!window.confirm("정말로 이 시간표를 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/schedule/timeblocks/${blockId}`);
            setTimeblocks(prev => prev.filter(b => b.id !== blockId));
            const newAssignments = { ...assignments };
            delete newAssignments[blockId];
            setAssignments(newAssignments);
            alert("삭제되었습니다.");
        } catch (error) {
            console.error(error);
            alert("삭제 실패!");
        }
    };

    // [추가 기능] 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBlock({ ...newBlock, [name]: value });
    };

    // [추가 기능] 수업 추가 핸들러
    const handleAddBlock = async () => {
        if (!newBlock.teacher) {
            alert("선생님 이름을 입력해주세요!");
            return;
        }
        const newId = `NEW_${Date.now()}`;
        const blockToAdd = { ...newBlock, id: newId };

        try {
            await axios.post('http://localhost:5000/api/schedule/timeblocks', blockToAdd);
            setTimeblocks([...timeblocks, blockToAdd]);
            alert("새로운 수업이 추가되었습니다!");
        } catch (error) {
            console.error(error);
            alert("추가 실패!");
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Timeblocks</h1>

                <div className="button-group">
                    <button onClick={handleSave} className="save-button">💾 저장하기</button>
                    <button onClick={handleAutoAssign} className="auto-button">🤖 자동 배정</button>
                    <button onClick={handleReset} className="reset-button">🧹 초기화</button>
                </div>

                {/* ➕ 새 수업 추가 폼 */}
                <div className="add-block-form">
                    <h3>➕ 새 수업 추가</h3>
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
                            placeholder="선생님/수업명"
                            value={newBlock.teacher}
                            onChange={handleInputChange}
                        />

                        <button onClick={handleAddBlock}>추가</button>
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
            </main>
        </div>
    );
}

export default App;