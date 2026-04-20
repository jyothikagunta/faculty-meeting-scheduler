const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));

const schedulerRoutes = require("./routes/schedulerRoutes");
app.use("/api/scheduler", schedulerRoutes);

const topSlotsRoutes = require("./routes/topSlotsRoutes");
app.use("/api/top-slots", topSlotsRoutes);

// ================= STATIC =================
app.use("/uploads", express.static("uploads"));

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("Faculty Scheduler API Running 🚀");
});

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/notifications", notificationRoutes);
const debugRoutes = require("./routes/debugRoutes");
app.use("/api/debug", debugRoutes);
