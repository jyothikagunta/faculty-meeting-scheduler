import { useEffect, useState } from "react";
import api from "../api/axios";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/notifications")
      .then(r => setNotifications(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString("en-IN", {
      day:"numeric", month:"short", year:"numeric",
      hour:"2-digit", minute:"2-digit",
    });
  };

  return (
    <div style={{ maxWidth:680 }}>
      <div className="section-header mb-20">
        <div>
          <div className="section-title">Notifications</div>
          <div className="section-subtitle">{notifications.length} total alert{notifications.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={{
        background:"var(--surface)",
        border:"1px solid var(--border)",
        borderRadius:"var(--radius-lg)",
        overflow:"hidden"
      }}>
        {loading ? (
          <div className="empty-state"><div className="spinner" style={{ width:28, height:28, borderWidth:3 }} /></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-text">No notifications yet</div>
            <div className="empty-state-sub">Alerts will appear here when meetings are booked</div>
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="notif-item">
              <div className="notif-dot" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, color:"var(--text-1)", lineHeight:1.5 }}>{n.message}</div>
                <div style={{ fontSize:12, color:"var(--text-3)", marginTop:4 }}>{formatTime(n.createdAt)}</div>
              </div>
              <span className="badge badge-blue" style={{ flexShrink:0 }}>New</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPage;