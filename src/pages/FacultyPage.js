import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchFaculty = async () => {
    try {
      const res = await api.get("/api/faculty");
      setFaculty(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      await api.delete(`/api/faculty/${id}`);
      setFaculty(prev => prev.filter(f => f._id !== id));
    } catch { alert("Delete failed."); }
  };

  const initials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const filtered = faculty.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="section-header mb-20">
        <div>
          <div className="section-title">Faculty Members</div>
          <div className="section-subtitle">{faculty.length} members registered</div>
        </div>
        <input
          className="form-input"
          style={{ width: 240 }}
          placeholder="🔍  Search faculty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-text">No faculty found</div>
          <div className="empty-state-sub">
            {search ? "Try a different search term" : "Upload a timetable PDF to add faculty"}
          </div>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map(f => (
            <div key={f._id} className="faculty-card">
              {/* Top row */}
              <div className="flex items-start gap-12">
                <div className="faculty-avatar">{initials(f.name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:"var(--text-1)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize:12, color:"var(--text-3)", marginTop:2 }}>
                    {f.role || "Faculty"} · {f.department || "Dept N/A"}
                  </div>
                </div>
              </div>

              {/* Code badge */}
              {f.facultyCode && (
                <div>
                  <span className="badge badge-blue">🔑 {f.facultyCode}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-8" style={{ marginTop:"auto" }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ flex:1 }}
                  onClick={() => setSelectedPdf(f.pdfUrl)}
                >
                  📄 Timetable
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(f._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
            backdropFilter:"blur(6px)", zIndex:999,
            display:"flex", alignItems:"center", justifyContent:"center", padding:24
          }}
          onClick={() => setSelectedPdf(null)}
        >
          <div
            style={{
              background:"var(--surface)", borderRadius:"var(--radius-xl)",
              border:"1px solid var(--border-2)", padding:24, width:"90%", maxWidth:900,
              maxHeight:"90vh", display:"flex", flexDirection:"column", gap:16
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div style={{ fontWeight:700, fontSize:16 }}>📄 Timetable Preview</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPdf(null)}>✕ Close</button>
            </div>
            <iframe
              src={selectedPdf}
              title="Timetable PDF"
              style={{ flex:1, border:"none", borderRadius:"var(--radius-sm)", minHeight:500 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FacultyPage;