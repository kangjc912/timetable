import React from 'react';
import './Timetable.css';

const Timetable = ({ timeblocks }) => {
    
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
                                {blocksByday[day].map(block => (
                                    <div key={block.id} className="timeblock">
                                        <strong>{block.startTime} - {block.endTime}</strong><br />
                                        선생님: {block.teacher}<br />
                                        <div className="ta-slot">
                                            필요 조교 수: {block.requiredTAs}
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

