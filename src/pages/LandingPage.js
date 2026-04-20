import React from "react";
import { useNavigate } from "react-router-dom";

const CARDS = [
  {
    icon: "📤", title: "Upload Timetable",
    desc: "Upload faculty PDF timetables to extract schedules automatically.",
    path: "/upload", accentClass: "blue",
  },
  {
    icon: "👥", title: "Faculty",
    desc: "Browse and manage registered faculty members and their timetables.",
    path: "/faculty", accentClass: "violet",
  },
  {
    icon: "📅", title: "Scheduler",
    desc: "Select faculty members and find the best available meeting slots.",
    path: "/schedule", accentClass: "green",
  },
  {
    icon: "🤝", title: "Meetings",
    desc: "View, track and cancel all booked meetings in one place.",
    path: "/meetings", accentClass: "blue",
  },
  {
    icon: "⚡", title: "Top Slots",
    desc: "Smart AI-ranked suggestions for the best times to meet all faculty.",
    path: "/top-slots", accentClass: "amber",
  },
  {
    icon: "🔔", title: "Notifications",
    desc: "Stay up to date with alerts, meeting confirmations and reminders.",
    path: "/notifications", accentClass: "violet",
  },
];

const ACCENT_COLORS = {
  blue:   { bg: "rgba(79,142,247,0.12)",  color: "var(--accent-2)" },
  green:  { bg: "var(--green-bg)",         color: "var(--green)" },
  amber:  { bg: "var(--amber-bg)",         color: "var(--amber)" },
  violet: { bg: "rgba(167,139,250,0.12)",  color: "var(--violet)" },
};

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(79,142,247,0.08) 0%, rgba(124,58,237,0.08) 100%)",
        border: "1px solid var(--border-2)",
        borderRadius: "var(--radius-xl)",
        padding: "28px 32px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
      }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.5px", color:"var(--text-1)", marginBottom:6 }}>
            Welcome to FacultySync 👋
          </div>
          <div style={{ fontSize:14, color:"var(--text-2)", maxWidth:480 }}>
            Smart meeting and timetable management for your institution. Upload timetables, find free slots, and book meetings in seconds.
          </div>
        </div>
        <div style={{ fontSize:56, opacity:0.6, flexShrink:0 }}>📅</div>
      </div>

      {/* Quick Stats row */}
      <div className="section-header">
        <div>
          <div className="section-title">Quick Access</div>
          <div className="section-subtitle">Jump to any section of the application</div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid-auto">
        {CARDS.map((card) => {
          const accent = ACCENT_COLORS[card.accentClass];
          return (
            <div
              key={card.path}
              onClick={() => navigate(card.path)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "22px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = accent.color;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 46, height: 46,
                background: accent.bg,
                borderRadius: "var(--radius-sm)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                marginBottom: 16,
              }}>
                {card.icon}
              </div>
              <div style={{ fontWeight:700, fontSize:15, color:"var(--text-1)", marginBottom:6 }}>
                {card.title}
              </div>
              <div style={{ fontSize:13, color:"var(--text-3)", lineHeight:1.5 }}>
                {card.desc}
              </div>
              <div style={{ marginTop:16, fontSize:13, color:accent.color, fontWeight:600 }}>
                Open →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LandingPage;