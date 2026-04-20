import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Navbar";
import LandingPage    from "./pages/LandingPage";
import FacultyPage    from "./pages/FacultyPage";
import SchedulerPage  from "./pages/SchedulerPage";
import UploadPage     from "./pages/UploadPage";
import TimetablePage  from "./pages/TimetablePage";
import MeetingPage    from "./pages/MeetingPage";
import TopSlotsPage   from "./pages/TopSlotsPage";
import NotificationPage from "./pages/NotificationPage";
import Login          from "./pages/Login";
import Register       from "./pages/Register";

const PAGE_META = {
  "/":             { title: "Dashboard",      subtitle: "Overview of your scheduling system" },
  "/faculty":      { title: "Faculty",         subtitle: "Manage and view faculty profiles" },
  "/schedule":     { title: "Scheduler",       subtitle: "Find and book available meeting slots" },
  "/meetings":     { title: "Meetings",        subtitle: "All booked and upcoming meetings" },
  "/upload":       { title: "Upload Timetable",subtitle: "Upload faculty PDF timetables" },
  "/top-slots":    { title: "Top Slots",       subtitle: "Smart suggestions across all faculty" },
  "/notifications":{ title: "Notifications",   subtitle: "Activity alerts and reminders" },
};

function LayoutWrapper({ children }) {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: "FacultySync", subtitle: "" };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            {meta.subtitle && <div className="topbar-subtitle">{meta.subtitle}</div>}
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return <LayoutWrapper>{children}</LayoutWrapper>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/login"    element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        

        <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn}><LandingPage /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute isLoggedIn={isLoggedIn}><FacultyPage /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute isLoggedIn={isLoggedIn}><SchedulerPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute isLoggedIn={isLoggedIn}><UploadPage /></ProtectedRoute>} />
        <Route path="/timetable/:id" element={<ProtectedRoute isLoggedIn={isLoggedIn}><TimetablePage /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute isLoggedIn={isLoggedIn}><MeetingPage /></ProtectedRoute>} />
        <Route path="/top-slots" element={<ProtectedRoute isLoggedIn={isLoggedIn}><TopSlotsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute isLoggedIn={isLoggedIn}><NotificationPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;