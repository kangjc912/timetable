// ... (imports)
import React from 'react';
import './Timetable.css';

const Timetable = ({ timeblocks, tas, assignments, onAssign, onDeleteBlock }) => {

    //시간대별로 묶기
    const groupBlocksByTime = (blocks) => {
        const groups = {};

        blocks.forEach(block => {

            const timeKey = `${block.startTime}-${block.endTime}`;
            if (!groups[timeKey]) {
                groups[timeKey] = [];
            }
            groups[timeKey].push(block);
        });

        return Object.entries(groups).sort(([timeA], [timeB]) =>
            timeA.localeCompare(timeB)
        );
    };


    //시간 겹침 확인
    const checkOverlap = (blockA, blockB) => {
        if (blockA.day !== blockB.day) return false; // 요일 다르면 안 겹침
        if (blockA.id === blockB.id) return false;   // 자기 자신과는 안 겹침

        const parseTime = (t) => parseInt(t.replace(':', ''));
        const startA = parseTime(blockA.startTime);
        const endA = parseTime(blockA.endTime);
        const startB = parseTime(blockB.startTime);
        const endB = parseTime(blockB.endTime);

        return startA < endB && endA > startB;
    };

    const blocksByDay = {
        '월': groupBlocksByTime(timeblocks.filter(b => b.day === '월')),
        '화': groupBlocksByTime(timeblocks.filter(b => b.day === '화')),
        '수': groupBlocksByTime(timeblocks.filter(b => b.day === '수')),
        '목': groupBlocksByTime(timeblocks.filter(b => b.day === '목')),
        '금': groupBlocksByTime(timeblocks.filter(b => b.day === '금')),
        '토': groupBlocksByTime(timeblocks.filter(b => b.day === '토')),
        '일': groupBlocksByTime(timeblocks.filter(b => b.day === '일')),
    };

    const days = ['월', '화', '수', '목', '금', '토', '일'];

    return (
        <div className="timetable-container">
            <h2>시간표</h2>
            <table className="timetable">
                <thead>
                    <tr>
                        {days.map(day => (
                            <th key={day} className="day-header">{day}요일</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {days.map(day => (
                            <td key={day} className="day-column">
                                {blocksByDay[day].map(([timeKey, blocksInGroup]) => (
                                    <div key={timeKey} className="time-group">
                                        <h4 className="time-group-header">{timeKey}</h4>
                                        <div className="time-blocks-wrapper">
                                            {blocksInGroup.map(block => {
                                                const availableTAs = tas.filter(ta =>
                                                    ta.availableBlockIds.includes(block.id)
                                                );

                                                return (
                                                    <div key={block.id} className="time-block">

                                                        <button
                                                            onClick={() => onDeleteBlock(block.id)}
                                                            className="delete-block-btn"
                                                            title="이 시간표 삭제"
                                                        >
                                                            ❌
                                                        </button>

                                                        <strong>{block.teacher} 선생님</strong>
                                                        <p>{block.startTime} - {block.endTime}</p>

                                                        <div className="ta-slot">
                                                            {availableTAs.map(ta => {
                                                                const currentTAs = assignments[block.id] || [];
                                                                const isChecked = currentTAs.includes(ta.id);

                                                                let isDisabled = false;

                                                                // 이 조교가 배정된 모든 다른 블럭
                                                                for (const [assignedBlockId, assignedTaIds] of Object.entries(assignments)) {
                                                                    if (assignedTaIds.includes(ta.id)) {
                                                                        // 그 블럭 정보 찾기
                                                                        const otherBlock = timeblocks.find(b => b.id === assignedBlockId);
                                                                        // 현재 블럭과 시간이 겹치는지 확인
                                                                        if (otherBlock && checkOverlap(block, otherBlock)) {
                                                                            isDisabled = true;
                                                                            break; // 하나라도 겹치면 즉시 중단
                                                                        }
                                                                    }
                                                                }
                                                                return (
                                                                    <div key={ta.id} className="ta-checkbox-wrapper">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`cb-${block.id}-${ta.id}`}
                                                                            checked={isChecked}
                                                                            disabled={isDisabled}
                                                                            onChange={(e) => onAssign(block.id, ta.id, e.target.checked)}
                                                                        />
                                                                        <label htmlFor={`cb-${block.id}-${ta.id}`}>
                                                                            {ta.name}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}

                                                            {(assignments[block.id] || []).length > 0 && (
                                                                <p className="assigned-ta">
                                                                    배정됨: {assignments[block.id]
                                                                        .map(taId => tas.find(t => t.id === taId)?.name)
                                                                        .join(', ')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;