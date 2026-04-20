import { useEffect, useState } from "react";
import api from "../api/axios";

function TopSlotsPage() {
  const [allFree,  setAllFree]  = useState([]);
  const [partial,  setPartial]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState("free");

  useEffect(() => {
    api.get("/api/top-slots")
      .then(r => { setAllFree(r.data.allFree || []); setPartial(r.data.partial || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (slot) => {
    try {
      await api.post("/api/scheduler/book-all", {
        day: slot.day, startTime: slot.startTime, endTime: slot.endTime,
      });
      alert("✅ Meeting booked for ALL faculty!");
    } catch { alert("❌ Booking failed"); }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid-2 mb-24">
        <div className="stat-card">
          <div className="stat-icon green">⚡</div>
          <div>
            <div className="stat-value text-green">{allFree.length}</div>
            <div className="stat-label">Fully Free Slots</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">⚠️</div>
          <div>
            <div className="stat-value text-amber">{partial.length}</div>
            <div className="stat-label">Partial Slots</div>
          </div>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="pill-toggle mb-20" style={{ maxWidth:320 }}>
        <button className={`pill-btn${activeTab==="free" ? " active" : ""}`} onClick={() => setActiveTab("free")}>
          ✅ All Available ({allFree.length})
        </button>
        <button className={`pill-btn${activeTab==="partial" ? " active" : ""}`} onClick={() => setActiveTab("partial")}>
          ⚠️ Partial ({partial.length})
        </button>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width:28, height:28, borderWidth:3 }} /></div>
      ) : activeTab === "free" ? (
        allFree.length === 0 ? (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)" }}>
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">No fully free slots found</div>
              <div className="empty-state-sub">Upload more timetables or check partial slots</div>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            {allFree.map((slot, i) => (
              <div key={i} className="slot-card free">
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span className="status-dot green" />
                    <span style={{ fontWeight:700, fontSize:15, color:"var(--text-1)" }}>{slot.day}</span>
                  </div>
                  <div style={{ fontSize:13, color:"var(--text-2)" }}>🕐 {slot.time}</div>
                  <div style={{ fontSize:12, color:"var(--green)", marginTop:4, fontWeight:500 }}>All faculty available 🎉</div>
                </div>
                <button className="btn btn-success btn-sm" onClick={() => handleBook(slot)}>
                  Book All
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        partial.length === 0 ? (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)" }}>
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <div className="empty-state-text">No partial slots found</div>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            {partial.map((slot, i) => (
              <div key={i} className="slot-card partial">
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span className="status-dot amber" />
                    <span style={{ fontWeight:700, fontSize:15, color:"var(--text-1)" }}>{slot.day}</span>
                  </div>
                  <div style={{ fontSize:13, color:"var(--text-2)" }}>🕐 {slot.time}</div>
                  <div style={{ fontSize:12, color:"var(--amber)", marginTop:4, fontWeight:500 }}>
                    {slot.busyCount} busy · {slot.busyFaculty?.join(", ")}
                  </div>
                </div>
                <button
                  className="btn btn-sm"
                  style={{ background:"rgba(251,191,36,0.15)", color:"var(--amber)", border:"1px solid var(--amber-border)" }}
                  onClick={() => handleBook(slot)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default TopSlotsPage;