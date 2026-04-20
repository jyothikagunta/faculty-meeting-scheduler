import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TIME_SLOTS = [
  "09:00-09:50","10:00-10:50","11:00-11:50","12:00-12:50",
  "13:00-13:50","14:00-14:50","15:00-15:50","16:00-17:30",
];

function TimetablePage() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/timetable/${id}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const grid = {};
  DAYS.forEach(day => {
    grid[day] = {};
    TIME_SLOTS.forEach(slot => { grid[day][slot] = null; });
  });
  data.forEach(item => {
    const cleanStart = item.startTime?.trim();
    const correctSlot = TIME_SLOTS.find(s => s.startsWith(cleanStart));
    if (correctSlot) grid[item.day][correctSlot] = item.subject;
  });

  return (
    <div>
      <div className="section-header mb-20">
        <div>
          <div className="section-title">Timetable View</div>
          <div className="section-subtitle">Weekly schedule grid</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width:28, height:28, borderWidth:3 }} /></div>
      ) : (
        <div className="card">
          <div className="table-wrapper" style={{ border:"none" }}>
            <table className="timetable-table">
              <thead>
                <tr>
                  <th style={{ width:110, textAlign:"left" }}>Day</th>
                  {TIME_SLOTS.map(slot => (
                    <th key={slot}>{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="day-cell">{day}</td>
                    {TIME_SLOTS.map(slot => {
                      const subject = grid[day][slot];
                      return (
                        <td key={slot} className={subject ? "busy-cell" : "free-cell"}>
                          {subject || <span style={{ color:"var(--text-3)", fontSize:11 }}>—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetablePage;