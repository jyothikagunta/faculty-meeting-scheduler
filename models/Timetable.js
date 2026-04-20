const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
    index: true
  },

  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },

  startTime: {
    type: String,
    required: true
  },

  endTime: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  room: {
    type: String,
    default: "TBD"
  }

}, {
  timestamps: true
});

// 🔥 Prevent duplicate entries (very important)
timetableSchema.index(
  { faculty: 1, day: 1, startTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);