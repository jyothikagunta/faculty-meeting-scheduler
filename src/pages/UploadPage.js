import { useState } from "react";
import api from "../api/axios";

function UploadPage() {
  const [file,     setFile]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleUpload = async () => {
    if (!file) { alert("Please select a PDF file first."); return; }
    setLoading(true); setSuccess(false);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/api/timetable/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setFile(null);
    } catch { alert("Upload failed ❌"); }
    finally  { setLoading(false); }
  };

  return (
    <div style={{ maxWidth:520, margin:"0 auto" }}>
      <div style={{
        background:"var(--surface)",
        border:"1px solid var(--border)",
        borderRadius:"var(--radius-lg)",
        overflow:"hidden"
      }}>
        <div className="card-header">
          <span className="card-title">📤 Upload Faculty Timetable</span>
        </div>
        <div className="card-body">
          <p style={{ fontSize:13.5, color:"var(--text-2)", marginBottom:24, lineHeight:1.6 }}>
            Upload a faculty timetable in <strong style={{ color:"var(--text-1)" }}>PDF format</strong>. 
            The system will automatically parse it, extract the faculty name and schedule, 
            and make it available for meeting scheduling.
          </p>

          {/* Drop zone */}
          <label
            htmlFor="pdf-upload"
            style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", gap:12,
              border:`2px dashed ${file ? "var(--accent)" : "var(--border-2)"}`,
              borderRadius:"var(--radius-lg)",
              background: file ? "rgba(79,142,247,0.06)" : "var(--bg-3)",
              padding:"40px 20px", cursor:"pointer", transition:"all 0.2s",
              minHeight:160,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(79,142,247,0.06)"; }}
            onMouseLeave={e => { if(!file) { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.background = "var(--bg-3)"; }}}
          >
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              style={{ display:"none" }}
              onChange={e => { setFile(e.target.files[0]); setSuccess(false); }}
            />
            <div style={{ fontSize:36 }}>{file ? "📄" : "⬆️"}</div>
            {file ? (
              <>
                <div style={{ fontWeight:600, color:"var(--text-1)", fontSize:14 }}>{file.name}</div>
                <div style={{ fontSize:12, color:"var(--text-3)" }}>{(file.size / 1024).toFixed(1)} KB · Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontWeight:600, color:"var(--text-1)", fontSize:14 }}>Click to select a PDF</div>
                <div style={{ fontSize:12, color:"var(--text-3)" }}>Or drag and drop here</div>
              </>
            )}
          </label>

          {success && (
            <div style={{
              marginTop:16, background:"var(--green-bg)", border:"1px solid var(--green-border)",
              color:"var(--green)", borderRadius:"var(--radius-sm)", padding:"10px 14px",
              fontSize:13.5, fontWeight:500
            }}>
              ✅ Timetable uploaded and parsed successfully!
            </div>
          )}

          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop:20 }}
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? <><span className="spinner" /> Uploading...</> : "Upload Timetable →"}
          </button>

          {!file && (
            <p style={{ textAlign:"center", fontSize:12, color:"var(--text-3)", marginTop:12 }}>
              Supported format: PDF only
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;