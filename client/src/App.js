import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Timetable from './components/Timetable';
import Dashboard from './components/Dashboard';


function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [tas, setTas] = useState([]);

    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);


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

    if (loading) {
        return <div>Loading...</div>;
    }











    // --- (App 컴포넌트 내부) ---

    const handleAssign = (timeblockId, taId, isChecked) => {
        const currentTAs = assignments[timeblockId] || [];
        let newTAs = [];

        if (isChecked) {
            // [추가 시 검사 로직]

            // 1. 최대 2명 검사
            if (currentTAs.length >= 2) {
                alert("이 시간표에는 최대 2명까지만 배정할 수 있습니다.");
                return;
            }

            // 2. 3연강(최대 2연강) 검사
            const currentBlock = timeblocks.find(b => b.id === timeblockId);
            // (위에서 만든 헬퍼 함수 사용)
            if (!checkConsecutive(taId, currentBlock, assignments, timeblocks)) {
                alert("해당 조교는 3타임 연속(3연강)으로 배정할 수 없습니다.");
                return;
            }

            newTAs = [...currentTAs, taId];
        } else {

            newTAs = currentTAs.filter(id => id !== taId);
        }

        const newAssignments = {
            ...assignments,
            [timeblockId]: newTAs
        };
        setAssignments(newAssignments);
    };











    const handleSave = async () => {
        try {
            // 1. 현재 React의 assignments state를
            // 2. '/api/assignments' (POST)로 전송합니다.
            const response = await axios.post('http://localhost:5000/api/assignments', assignments);

            // 3. 서버의 응답(message)을 alert으로 띄웁니다.
            alert(response.data.message);
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장에 실패했습니다.');
        }
    };






    const handleReset = () => {
        if (window.confirm("정말로 모든 배정 내용을 지우시겠습니까?")) {
            setAssignments({});
        }
    };








    const handleAutoAssign = () => {
        let nextAssignments = { ...assignments };


        const MAX_WORKLOAD = 4;


        const getWorkload = (taId) => {
            return Object.values(nextAssignments).flat().filter(id => id === taId).length;
        };


        const isCandidateValid = (ta, block, currentAssigned) => {
            // 1. 시간 안 되면 탈락
            if (!ta.availableBlockIds.includes(block.id)) return false;
            // 2. 이미 들어와 있으면 탈락
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

        timeblocks.forEach(block => {
            const requiredCount = block.requiredTAs || 1;


            const validCandidates = tas.filter(ta => {
                // 아직 배정되지 않은 상태 기준으로 체크
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




        const remainingBlocks = timeblocks.filter(block => {
            const current = nextAssignments[block.id] || [];
            return current.length < (block.requiredTAs || 1);
        });

        remainingBlocks.forEach(block => {
            const currentAssigned = nextAssignments[block.id] || [];
            const requiredCount = block.requiredTAs || 1;
            const needed = requiredCount - currentAssigned.length;

            // 1. 후보 찾기
            let candidates = tas.filter(ta => {
                // 기본 조건 통과 확인
                if (!isCandidateValid(ta, block, currentAssigned)) return false;


                if (getWorkload(ta.id) >= MAX_WORKLOAD) return false;

                return true;
            });

            // 2. "일 적게 한 사람" 순서로 정렬 (일감 몰아주기 방지)
            candidates.sort((a, b) => getWorkload(a.id) - getWorkload(b.id));

            // 3. 필요한 만큼 앞에서부터 채우기
            for (let i = 0; i < needed; i++) {
                if (candidates[i]) {
                    if (!nextAssignments[block.id]) nextAssignments[block.id] = [];
                    nextAssignments[block.id].push(candidates[i].id);
                }
            }
        });

        // 결과 저장
        const totalAssigned = Object.values(nextAssignments).flat().length;
        setAssignments(nextAssignments);
        alert(`🤖 배정 완료! (총 ${totalAssigned}건)`);
    };












    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Timeblocks</h1>

                <button onClick={handleSave} className="save-button">배정표 저장하기</button>


                <button onClick={handleReset} className="reset-button">초기화</button>


                <button onClick={handleAutoAssign} className="auto-button">🤖 자동 배정</button>

            </header>
            <main>
                <Timetable
                    timeblocks={timeblocks}
                    tas={tas}
                    assignments={assignments}
                    onAssign={handleAssign}
                />

                <Dashboard tas={tas} assignments={assignments} />
            </main>

            <hr />
        </div>
    );
}

export default App;

const checkConsecutive = (taId, newBlock, currentAssignments, allTimeblocks) => {
    // 1. 시간 문자열("17:00")을 숫자(1700)로 바꾸는 함수
    const parseTime = (t) => parseInt(t.replace(':', ''), 10);

    // 2. 이 조교가 배정된 '모든' 시간표 ID를 가져옴
    const assignedBlockIds = Object.keys(currentAssignments).filter(blockId =>
        currentAssignments[blockId].includes(taId)
    );

    // 3. 그 ID들을 '실제 시간표 객체'로 바꿈 + '같은 요일'만 필터링
    const dayBlocks = [...assignedBlockIds, newBlock.id]
        .map(id => allTimeblocks.find(b => b.id === id))
        .filter(b => b && b.day === newBlock.day);

    // 4. 중복 제거 (혹시 모를 오류 방지)
    const uniqueBlocks = [...new Set(dayBlocks)];

    // 5. 시작 시간 순서대로 정렬 (오전 10시 -> 오후 1시 ...)
    uniqueBlocks.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

    // 6. 연속된 횟수 세기
    let streak = 1;
    for (let i = 0; i < uniqueBlocks.length - 1; i++) {
        const current = uniqueBlocks[i];
        const next = uniqueBlocks[i + 1];

        // 앞 교시 끝나는 시간 == 뒷 교시 시작 시간 (연강)
        if (parseTime(current.endTime) === parseTime(next.startTime)) {
            streak++;
        } else {
            streak = 1; // 끊기면 리셋
        }

        if (streak >= 3) return false; // 3연강 발견 (실패)
    }

    return true; // 통과
};






// 두 시간표가 겹치는지 확인하는 헬퍼 함수

const checkOverlap = (blockA, blockB) => {
    if (blockA.day !== blockB.day) return false;
    if (blockA.id === blockB.id) return false; // 자기 자신 제외

    const parseTime = (t) => parseInt(t.replace(':', ''), 10);
    const startA = parseTime(blockA.startTime);
    const endA = parseTime(blockA.endTime);
    const startB = parseTime(blockB.startTime);
    const endB = parseTime(blockB.endTime);

    return startA < endB && endA > startB;
};