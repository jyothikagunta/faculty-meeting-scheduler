const Faculty = require("../models/Faculty");
const Meeting = require("../models/Meeting");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/mailer");

// =========================
// 🔥 COMMON MATCH FUNCTION
// =========================
function isSlotMatch(t, day, time) {
  const tDay = t.day?.trim().toLowerCase();
  const tTime = t.time?.replace(/\s/g, "");

  const currentDay = day.toLowerCase();
  const currentTime = time.replace(/\s/g, "");

  return tDay === currentDay && tTime === currentTime;
}

// =========================
// 🔥 GET ALL SLOTS (FREE + PARTIAL)
// =========================
exports.getBestSlots = async (req, res) => {
  try {
    const { facultyIds } = req.body;

    const facultyList = await Faculty.find({
      _id: { $in: facultyIds }
    });

    if (!facultyList.length) {
      return res.json({ message: "No faculty selected" });
    }

    const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    const TIME_SLOTS = [
      "09:00-09:50","10:00-10:50","11:00-11:50","12:00-12:50",
      "13:00-13:50","14:00-14:50","15:00-15:50","16:00-17:30"
    ];

    const allFree = [];
    const partial = [];

    for (let day of DAYS) {
      for (let time of TIME_SLOTS) {

        let busyFaculty = [];

        for (let f of facultyList) {

          // 🔴 treat missing timetable as BUSY
          if (!f.timetable || f.timetable.length === 0) {
            busyFaculty.push(f.name);
            continue;
          }

          const isBusy = f.timetable.some(t =>
            isSlotMatch(t, day, time)
          );

          if (isBusy) {
            busyFaculty.push(f.name);
          }
        }

        const [startTime, endTime] = time.split("-");

        // ✅ FULLY FREE
        if (busyFaculty.length === 0) {
          allFree.push({
            day,
            time,
            startTime,
            endTime
          });
        }

        // ⚠️ PARTIAL
        else {
          partial.push({
            day,
            time,
            startTime,
            endTime,
            busyFaculty,
            busyCount: busyFaculty.length
          });
        }
      }
    }

    // 🔥 SORT PARTIAL → least busy first
    partial.sort((a, b) => a.busyCount - b.busyCount);

    console.log("✅ ALL FREE:", allFree.length);
    console.log("⚠️ PARTIAL:", partial.length);

    res.json({
      allFree,
      partial
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// 🔥 BOOK MEETING
// =========================
exports.bookMeeting = async (req, res) => {
  try {
    const { facultyIds, day, startTime, endTime } = req.body;

    const newMeeting = await Meeting.create({
      facultyIds,
      day,
      startTime,
      endTime,
    });

    const faculty = await Faculty.find({
      _id: { $in: facultyIds }
    });

    const names = faculty.map(f => f.name);

    // 🔥 ONLY SEND TO ADMIN
    const emails = [process.env.EMAIL_USER];

    // 🔥 IMPROVED MESSAGE
    const message = `
📅 Meeting Scheduled

Day: ${day}
Time: ${startTime} - ${endTime}

Participants:
${names.join(", ")}
`;

    // 🔥 SAVE NOTIFICATION
    await Notification.create({
      message,
      recipients: emails,
      recipientNames: names,
    });

    // 🔥 SEND EMAIL
    if (emails.length > 0) {
      await sendEmail(
        emails, // ✅ no join
        "📅 New Meeting Scheduled",
        message
      );
    }

    res.json({
      success: true,
      message: "Meeting booked + notifications sent ✅",
      meeting: newMeeting
    });

  } catch (err) {
    console.error("❌ BOOK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// 🔥 BOOK FOR ALL (TOP SLOTS)
// =========================
exports.bookMeetingForAll = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;

    const facultyList = await Faculty.find();

    if (!facultyList.length) {
      return res.status(400).json({ message: "No faculty found" });
    }

    const facultyIds = facultyList.map(f => f._id);

    req.body.facultyIds = facultyIds;

    return exports.bookMeeting(req, res);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// 🔥 GET MEETINGS
// =========================
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =========================
// 🔥 DELETE MEETING
// =========================
exports.deleteMeeting = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};