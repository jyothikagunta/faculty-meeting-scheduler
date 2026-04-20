import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const NAV_ITEMS = [
  { name: "Dashboard",  path: "/",           icon: "⊞" },
  { name: "Faculty",    path: "/faculty",     icon: "👥" },
  { name: "Scheduler",  path: "/schedule",    icon: "📅" },
  { name: "Meetings",   path: "/meetings",    icon: "🤝" },
  { name: "Top Slots",  path: "/top-slots",   icon: "⚡" },
  { name: "Upload",     path: "/upload",      icon: "📤" },
];

function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    api.get("/api/notifications")
      .then(r => setNotifCount(r.data?.length || 0))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate("/")}>
        <div className="sidebar-logo-icon">📅</div>
        <div className="sidebar-logo-text">
          <span>FacultySync</span>
          <span>Scheduling System</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-section-title">Main Menu</span>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.path}
            className={`nav-item${isActive(item.path) ? " active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </div>
        ))}

        <span className="nav-section-title" style={{ marginTop: 12 }}>Alerts</span>
        <div
          className={`nav-item${isActive("/notifications") ? " active" : ""}`}
          onClick={() => navigate("/notifications")}
        >
          <span className="nav-icon">🔔</span>
          Notifications
          {notifCount > 0 && (
            <span className="nav-badge">{notifCount}</span>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span style={{ fontSize: 16 }}>→</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;