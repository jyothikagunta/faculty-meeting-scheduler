import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate  = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleRegister = async () => {
    if (!username || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6)    { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleRegister(); };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb" style={{ width:500, height:500, background:"#7c3aed", top:"-200px", right:"-150px" }} />
      <div className="auth-bg-orb" style={{ width:400, height:400, background:"#4f8ef7", bottom:"-150px", left:"-100px" }} />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">📅</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.3px" }}>FacultySync</div>
            <div style={{ fontSize:12, color:"var(--text-3)" }}>Scheduling System</div>
          </div>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Set up your account to get started</p>

        {error && (
          <div style={{
            background:"var(--red-bg)", border:"1px solid var(--red-border)",
            color:"var(--red)", borderRadius:"var(--radius-sm)",
            padding:"10px 14px", fontSize:13, marginBottom:16
          }}>
            {error}
          </div>
        )}

        <div className="flex-col gap-16">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleRegister}
            disabled={loading}
            style={{ marginTop:4 }}
          >
            {loading ? <><span className="spinner" /> Creating account...</> : "Create Account →"}
          </button>
        </div>

        <div className="divider" />

        <p style={{ textAlign:"center", fontSize:13.5, color:"var(--text-3)" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color:"var(--accent-2)", cursor:"pointer", fontWeight:600 }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;