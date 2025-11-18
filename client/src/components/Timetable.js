// ... (imports)
import React from 'react';
import './Timetable.css';

const Timetable = ({ timeblocks, tas, assignments, onAssign }) => {
    

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
                                                        <strong>{block.teacher} 선생님</strong>
                                                        <p>{block.startTime} - {block.endTime}</p>
                                                        
                                                        <div className="ta-slot">
                                                            {availableTAs.map(ta => {
                                                                const currentTAs = assignments[block.id] || [];
                                                                const isChecked = currentTAs.includes(ta.id);
                                                                return (
                                                                    <div key={ta.id} className="ta-checkbox-wrapper">
                                                                        <input 
                                                                            type="checkbox"
                                                                            id={`cb-${block.id}-${ta.id}`}
                                                                            checked={isChecked}
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