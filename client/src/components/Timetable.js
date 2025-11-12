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
                                    const availableTAs = tas.filter(ta => 
                                        ta.availableBlockIds.includes(block.id)
                                    );

                                    return (
                                        <div key={block.id} className="timeblock">
                                            <strong> {block.teacher} 선생님 </strong>
                                            <p>{block.startTime} - {block.endTime} </p>

                                            <div className="ta-slot">
                                                {availableTAs.map(ta=>{
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
                                                    <p className="assgined-ta">
                                                        배정됨: {assignments[block.id]
                                                                    .map(taId => tas.find(t => t.id === taId)?.name)
                                                                    .join(', ')}
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

