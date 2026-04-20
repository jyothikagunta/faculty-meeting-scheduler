📘 Faculty Scheduler System
🚀 Overview
The Faculty Scheduler System is a full-stack web application designed to automate the process of scheduling meetings between faculty members based on their availability.
The system analyzes uploaded timetables, identifies free and partially available slots, and enables efficient meeting booking with automated email notifications.
🎯 Problem Statement
Manual scheduling of meetings in academic environments is:
Time-consuming
Prone to conflicts
Inefficient
This system solves the problem by automating timetable analysis and slot selection.
✨ Features
📄 Timetable Upload & Parsing
Upload faculty timetables in PDF format
Automatically extract day and time slots
Store structured timetable data
📅 Smart Scheduler
Select multiple faculty members
Identify:
✅ Fully available slots
⚠️ Partially available slots
Suggest optimal meeting timings
⚡ Top Slots
Displays best meeting slots across all faculty
Helps in quick decision-making
📌 Meeting Booking
Book meetings for selected faculty
Stores meeting details in database
📧 Email Notifications
Automatically sends meeting details
Includes:
Day
Time
Participants
🔐 Authentication
Secure login using JWT
Protected routes for authorized access
🧱 Tech Stack
🔙 Backend
Node.js
Express.js
MongoDB
Mongoose
🔐 Authentication & Security
JWT (JSON Web Token)
bcryptjs
📄 File Handling
Multer (file upload)
PDF.co API (PDF → Text conversion)
📧 Notifications
Nodemailer (Gmail SMTP)
💻 Frontend
React.js
JavaScript (ES6+)
Axios
🏗️ Project Structure

faculty-scheduler/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.js
│
└── README.md
⚙️ Installation & Setup
🔹 Clone the Repository
Bash
git clone <your-repo-link>
cd faculty-scheduler
🔹 Backend Setup
Bash
cd backend
npm install
Create .env file:
Environment
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PDFCO_API_KEY=your_pdf_api_key
Run backend:
Bash
node server.js
🔹 Frontend Setup
Bash
cd frontend
npm install
npm start
🔄 Workflow
Upload faculty timetable (PDF)
System extracts timetable data
Select faculty members
System analyzes availability
Displays free & partial slots
Book meeting
Email notification sent
📊 Example Output
Fully Available Slots
Partially Available Slots with busy faculty
Email notification with meeting details
⚠️ Limitations
Uses temporary PDF links (may expire)
Demo uses generated email IDs
No role-based access (admin/user)
🚀 Future Enhancements
Role-based access (Admin / Faculty)
Calendar-based UI view
Real email integration
Conflict resolution improvements
Mobile responsiveness
🎓 Conclusion
The Faculty Scheduler System improves efficiency by:
Reducing manual effort
Avoiding scheduling conflicts
Automating communication