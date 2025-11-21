import React from 'react';
import './Dashboard.css';

const Dashboard = ({ tas, assignments }) => {

    // 1. 조교별 배정 횟수 계산
    const taStats = tas.map(ta => {
        let count = 0;

        Object.values(assignments).forEach(assignedIds => {
            if (assignedIds.includes(ta.id)) {
                count++;
            }
        });
        return { ...ta, count };
    });

    // 2. 많이 배정된 순서대로 정렬 
    taStats.sort((a, b) => b.count - a.count);

    // 3. 횟수에 따른 상태 표시 함수
    const getStatusBadge = (count) => {
        if (count === 0) return <span className="status-badge idle">💤 대기 중</span>;
        if (count >= 7) return <span className="status-badge over">🔥 과로 (7+)</span>;
        if (count >= 4) return <span className="status-badge warning">⚠️ 주의 (4~6)</span>;
        return <span className="status-badge good">✅ 적정 (1~3)</span>;
    };

    return (
        <div className="dashboard-container">
            <h2>📊 조교 배정 현황판</h2>
            <div className="table-wrapper">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>이름</th>
                            <th>배정 횟수</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taStats.map((ta, index) => (
                            <tr key={ta.id} className={ta.count === 0 ? 'row-idle' : ''}>
                                <td>{index + 1}</td>
                                <td className="ta-name">{ta.name}</td>
                                <td className="ta-count"><strong>{ta.count}</strong> 타임</td>
                                <td>{getStatusBadge(ta.count)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;