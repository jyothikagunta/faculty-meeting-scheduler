import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-bg-orb" style={{ width:500, height:500, background:"#4f8ef7", top:"-200px", left:"-150px" }} />
      <div className="auth-bg-orb" style={{ width:400, height:400, background:"#7c3aed", bottom:"-150px", right:"-100px" }} />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">📅</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.3px" }}>FacultySync</div>
            <div style={{ fontSize:12, color:"var(--text-3)" }}>Scheduling System</div>
          </div>
        </div>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop:4 }}
          >
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
          </button>
        </div>

        <div className="divider" />

        <p style={{ textAlign:"center", fontSize:13.5, color:"var(--text-3)" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color:"var(--accent-2)", cursor:"pointer", fontWeight:600 }}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;