import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // 서버에서 시간표 데이터 가져오기
        axios.get('http://localhost:5000/api/schedule/timeblocks')
            .then(response => {
                setTimeblocks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching timeblocks:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='App'>
          <header className='App-header'>
            <h1>Timeblocks</h1>
            <ul>
                {timeblocks.map(block => (
                    <li key={block.id}>
                      {block.teacher} 선생님 ({block.startTime})
                    </li>
                ))}
            </ul>
          </header>
        </div>
    );
}

export default App;
