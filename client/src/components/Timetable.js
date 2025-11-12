import React from 'react';
import './Timetable.css';

const Timetable = ({ timeblocks, tas, assignments, onAssign }) => {
    
    const blocksByday = {
        '월': timeblocks.filter(block => block.day === '월'),
        '화': timeblocks.filter(block => block.day === '화'),
        '수': timeblocks.filter(block => block.day === '수'),
        '목': timeblocks.filter(block => block.day === '목'),
        '금': timeblocks.filter(block => block.day === '금'),
        '토': timeblocks.filter(block => block.day === '토'),
        '일': timeblocks.filter(block => block.day === '일'),
    };

    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return (
        <div className="timetable-container">
            <h2>시간표</h2>
            <table className="timetable">
                <thead>
                    <tr>
                        {days.map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {days.map(day => (
                            <td key={day} className='day-column'>
                                {blocksByday[day].map(block => {

                                    const assignedTaId = assignments[block.id];
                                    const availablTAs = tas.filter(ta => 
                                        ta.availableBlockIds.includes(block.id)
                                    );

                                    return (
                                        <div key={block.id} className="timeblock">
                                            <strong> {block.teacher} 선생님 </strong>
                                            <p>{block.startTime} - {block.endTime} </p>

                                            <div className="ta-slot">
                                                <select
                                                    value={assignedTaId || ""}
                                                    onChange={(e) => onAssign(block.id, e.target.value)}
                                                >
                                                    <option value="">조교 선택</option>
                                                    {availablTAs.map(ta => (
                                                        <option key={ta.id} value={ta.id}>
                                                            {ta.name}
                                                        </option>
                                                    ))}   

                                                </select>

                                                {assignedTaId && (
                                                    <p className="assgined-ta">
                                                        배정됨: {tas.find(ta => ta.id === assignedTaId)?.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );

                                })}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;

