import React, { useEffect, useState } from "react";
import api from "../api/axios";

function SchedulerPage() {
  const [facultyList,     setFacultyList]     = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [data,            setData]            = useState(null);
  const [loading,         setLoading]         = useState(false);

  useEffect(() => {
    api.get("/api/faculty")
      .then(r => setFacultyList(r.data))
      .catch(console.error);
  }, []);

  const toggleFaculty = (id) =>
    setSelectedFaculty(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );

  const handleSearch = async () => {
    if (selectedFaculty.length === 0) {
      alert("Select at least one faculty member.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/scheduler/schedule", {
        facultyIds: selectedFaculty
      });

      // ✅ SAFE DATA SET (IMPORTANT FIX)
      setData({
  fullFree: Array.isArray(res.data?.allFree) ? res.data.allFree : [],
  partial: Array.isArray(res.data?.partial) ? res.data.partial : []
});

    } catch {
      alert("Failed to fetch slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slot) => {
    try {
      const [startTime, endTime] = slot.time.split("-");
      await api.post("/api/scheduler/book", {
        facultyIds: selectedFaculty,
        day: slot.day,
        startTime,
        endTime
      });
      alert("Meeting booked ✅");
    } catch {
      alert("Booking failed ❌");
    }
  };

  const initials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  // ✅ SAFE VARIABLES (PREVENT CRASH)
  const fullFree = Array.isArray(data?.fullFree) ? data.fullFree : [];
  const partial  = Array.isArray(data?.partial) ? data.partial : [];

  return (
    <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>

      {/* ── LEFT: Faculty Selector ── */}
      <div style={{ width:260, flexShrink:0 }}>
        <div style={{
          position:"sticky", top:0,
          background:"var(--surface)",
          border:"1px solid var(--border)",
          borderRadius:"var(--radius-lg)",
          overflow:"hidden"
        }}>
          <div className="card-header">
            <span className="card-title">Select Faculty</span>
            {selectedFaculty.length > 0 && (
              <span className="badge badge-blue">{selectedFaculty.length} selected</span>
            )}
          </div>

          <div className="card-body" style={{ padding:12 }}>
            {facultyList.length === 0 ? (
              <div className="empty-state" style={{ padding:"30px 10px" }}>
                <div className="empty-state-icon" style={{ fontSize:28 }}>👥</div>
                <div className="empty-state-text" style={{ fontSize:13 }}>No faculty found</div>
              </div>
            ) : (
              <div className="flex-col gap-4">
                {facultyList.map(f => {
                  const active = selectedFaculty.includes(f._id);
                  return (
                    <div
                      key={f._id}
                      onClick={() => toggleFaculty(f._id)}
                      style={{
                        display:"flex", alignItems:"center", gap:10,
                        padding:"9px 12px", borderRadius:"var(--radius-sm)",
                        cursor:"pointer", transition:"all 0.15s",
                        background: active ? "rgba(79,142,247,0.12)" : "transparent",
                        border: `1px solid ${active ? "rgba(79,142,247,0.3)" : "transparent"}`
                      }}
                      onMouseEnter={e => {
                        if(!active) e.currentTarget.style.background = "var(--bg-3)";
                      }}
                      onMouseLeave={e => {
                        if(!active) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{
                        width:30, height:30, borderRadius:"50%",
                        background: active ? "var(--accent)" : "var(--bg-4)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:700, color:"#fff", flexShrink:0
                      }}>
                        {initials(f.name)}
                      </div>

                      <div style={{
                        fontSize:13, fontWeight:500,
                        color: active ? "var(--accent-2)" : "var(--text-1)"
                      }}>
                        {f.name}
                      </div>

                      {active && (
                        <span style={{
                          marginLeft:"auto",
                          color:"var(--accent-2)",
                          fontSize:14
                        }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ padding:"12px 12px 16px" }}>
            <button
              className="btn btn-primary btn-full"
              onClick={handleSearch}
              disabled={loading || selectedFaculty.length === 0}
            >
              {loading
                ? <><span className="spinner" /> Finding slots...</>
                : "⚡ Find Best Slots"}
            </button>

            {selectedFaculty.length > 0 && (
              <button
                className="btn btn-ghost btn-full btn-sm"
                style={{ marginTop:6 }}
                onClick={() => setSelectedFaculty([])}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Results ── */}
      <div style={{ flex:1 }}>
        {!data ? (
          <div className="empty-state" style={{ padding:"80px 20px" }}>
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-text">No results yet</div>
            <div className="empty-state-sub">
              Select faculty from the left panel and click "Find Best Slots"
            </div>
          </div>
        ) : (
          <>
            {/* Fully Free */}
            <div className="mb-24">
              <div className="section-header mb-12">
                <div className="flex items-center gap-8">
                  <span className="status-dot green" />
                  <span className="section-title">Fully Available</span>
                  <span className="badge badge-green">{fullFree.length}</span>
                </div>
              </div>

              {fullFree.length === 0 ? (
                <div className="card">
                  <div className="card-body">
                    <div className="text-2 text-sm">
                      No fully free slots found for all selected faculty.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid-2">
                  {fullFree.map((s, i) => (
                    <div key={i} className="slot-card free">
                      <div>
                        <div style={{ fontWeight:700 }}>{s.day}</div>
                        <div style={{ fontSize:13 }}>🕐 {s.time}</div>
                      </div>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleBook(s)}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Partial */}
            <div>
              <div className="section-header mb-12">
                <div className="flex items-center gap-8">
                  <span className="status-dot amber" />
                  <span className="section-title">Partially Available</span>
                  <span className="badge badge-amber">{partial.length}</span>
                </div>
              </div>

              {partial.length === 0 ? (
                <div className="card">
                  <div className="card-body">
                    <div className="text-2 text-sm">No partial slots found.</div>
                  </div>
                </div>
              ) : (
                <div className="grid-2">
                  {partial.map((s, i) => (
                    <div key={i} className="slot-card partial">
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700 }}>{s.day}</div>
                        <div style={{ fontSize:13 }}>🕐 {s.time}</div>
                        <div style={{ fontSize:12, color:"red" }}>
                          Busy: {s.busyFaculty?.join(", ")}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleBook(s)}
                      >
                        Book
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SchedulerPage;