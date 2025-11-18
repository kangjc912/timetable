import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import Timetable from './components/Timetable';

function App() {
    const [timeblocks, setTimeblocks] = useState([]);
    const [tas, setTas] = useState([]);

    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
              const [timeblocksRes, tasRes,assignmentsRes] = await Promise.all([
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

    const handleAssign = (timeblockId, taId,isChecked) => {

      const currentTAs = assignments[timeblockId] || [];


      let newTAs = [];
      
      if(isChecked) {
        const currentBlock = timeblocks.find(b => b.id === timeblockId);
            
            if (currentTAs.length >= 2) {
                alert("이 시간표에는 최대 2명까지만 배정할 수 있습니다.");
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
        console.log('New Assignments:', newAssignments);
      }
  


    return (
        <div className='App'>
            <header className='App-header'>
              <h1>Timeblocks</h1>
            </header>
            <main>
                <Timetable 
                  timeblocks={timeblocks} 
                  tas={tas}
                  assignments={assignments}
                  onAssign={handleAssign}
                />
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
