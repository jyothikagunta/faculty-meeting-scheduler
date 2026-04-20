const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
  day: String,
  startTime: String,
  endTime: String,
  purpose: String
}, { timestamps: true });

module.exports = mongoose.model("Meeting", meetingSchema);