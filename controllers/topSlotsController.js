const Faculty = require("../models/Faculty");

// 🔥 SAME MATCH FUNCTION (IMPORTANT)
function isSlotMatch(t, day, time) {
  const tDay = t.day?.trim().toLowerCase();
  const tTime = t.time?.replace(/\s/g, "");

  const currentDay = day.toLowerCase();
  const currentTime = time.replace(/\s/g, "");

  return tDay === currentDay && tTime === currentTime;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "09:00-09:50",
  "10:00-10:50",
  "11:00-11:50",
  "12:00-12:50",
  "13:00-13:50",
  "14:00-14:50",
  "15:00-15:50",
  "16:00-17:30"
];

exports.getTopSlots = async (req, res) => {
  try {
    const facultyList = await Faculty.find();

    if (!facultyList.length) {
      return res.json({ message: "No faculty uploaded yet" });
    }

    const hod = facultyList.find(f => f.role === "HOD");

    if (!hod) {
      return res.json({ message: "HOD not found" });
    }

    const allFree = [];
    const partial = [];

    for (let day of DAYS) {
      for (let time of TIME_SLOTS) {

        let busyFaculty = [];

        for (let f of facultyList) {
          if (!f.timetable) continue;

          const isBusy = f.timetable.some(t =>
            isSlotMatch(t, day, time)
          );

          if (isBusy) {
            busyFaculty.push(f.name);
          }
        }

        const hodBusy = hod.timetable?.some(t =>
          isSlotMatch(t, day, time)
        );

        if (hodBusy) continue;

        const [startTime, endTime] = time.split("-");

        const slotData = {
          day,
          time,
          startTime,
          endTime,
          busyCount: busyFaculty.length,
          busyFaculty,
        };

        if (busyFaculty.length === 0) {
          allFree.push(slotData);
        } else {
          partial.push(slotData);
        }
      }
    }

    partial.sort((a, b) => a.busyCount - b.busyCount);

    res.json({
      allFree,
      partial
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};