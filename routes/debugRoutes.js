const express = require("express");
const router = express.Router();
const Faculty = require("../models/Faculty");

// 🔥 DEBUG: SHOW TIMETABLE + FREE SLOTS
router.get("/check-slots", async (req, res) => {
  try {
    const facultyList = await Faculty.find();

    const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    const TIME_SLOTS = [
      "09:00-09:50","10:00-10:50","11:00-11:50","12:00-12:50",
      "13:00-13:50","14:00-14:50","15:00-15:50","16:00-17:30"
    ];

    const result = [];

    for (let day of DAYS) {
      for (let time of TIME_SLOTS) {

        let busy = [];

        for (let f of facultyList) {
          const isBusy = f.timetable?.some(t =>
            t.day === day && t.time === time
          );

          if (isBusy) busy.push(f.name);
        }

        result.push({
          day,
          time,
          busy,
          isFree: busy.length === 0
        });
      }
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;