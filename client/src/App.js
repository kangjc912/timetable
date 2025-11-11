import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Timetable from './components/Timetable';

function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [tas, setTas] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
              const [timeblocksRes, tasRes] = await Promise.all([
                  axios.get('http://localhost:5000/api/schedule/timeblocks'),
                  axios.get('http://localhost:5000/api/tas')
              ]);
              setTimeblocks(timeblocksRes.data);
              setTas(tasRes.data);
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

    return (
        <div className='App'>
            <header className='App-header'>
              <h1>Timeblocks</h1>
            </header>
            <main>
                <Timetable timeblocks={timeblocks} />
            </main>
            
            <hr />

            <h1>Teaching Assistants</h1>
            <ul>
                {tas.map(ta => (
                    <li key={ta.id}>
                      {ta.name} ({ta.contact})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
