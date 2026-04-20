import { useEffect, useState } from "react";
import api from "../api/axios";

function MeetingPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/scheduler/meetings");
      setMeetings(res.data);
    } catch { console.error("Fetch error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this meeting?")) return;
    try {
      await api.delete(`/api/scheduler/meetings/${id}`);
      fetchMeetings();
    } catch { alert("Delete failed"); }
  };

  const DAYS_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const sorted = [...meetings].sort((a, b) =>
    DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
  );

  return (
    <div>
      <div className="section-header mb-20">
        <div>
          <div className="section-title">All Meetings</div>
          <div className="section-subtitle">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width:28, height:28, borderWidth:3 }} /></div>
      ) : sorted.length === 0 ? (
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)" }}>
          <div className="empty-state">
            <div className="empty-state-icon">🤝</div>
            <div className="empty-state-text">No meetings scheduled</div>
            <div className="empty-state-sub">Use the Scheduler to book a meeting slot</div>
          </div>
        </div>
      ) : (
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", overflow:"hidden" }}>
          <div className="table-wrapper" style={{ border:"none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Faculty</th>
                  <th>Purpose</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m, i) => (
                  <tr key={m._id}>
                    <td className="text-3 text-sm">{i + 1}</td>
                    <td>
                      <span className="badge badge-blue">{m.day}</span>
                    </td>
                    <td>
                      <span style={{ fontSize:13, fontWeight:600, color:"var(--text-1)", fontFamily:"monospace" }}>
                        {m.startTime} – {m.endTime}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize:13, color:"var(--text-2)" }}>
                        {m.facultyIds?.join(", ") || "—"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize:13, color:"var(--text-3)" }}>{m.purpose || "—"}</span>
                    </td>
                    <td style={{ textAlign:"right" }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(m._id)}
                      >
                        Cancel
                      </button>
                    </td>
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

export default MeetingPage;