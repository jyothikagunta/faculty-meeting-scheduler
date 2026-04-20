const express = require("express");
const router = express.Router();

// ✅ IMPORT MIDDLEWARE
const authMiddleware = require("../middleware/authMiddleware");

// ✅ IMPORT CONTROLLER
const schedulerController = require("../controllers/schedulerController");

// =========================
// 🔥 NORMAL SCHEDULER
// =========================
router.post(
  "/schedule",
  authMiddleware,
  schedulerController.getBestSlots
);

// =========================
// 🔥 BOOK MEETING (SELECTED FACULTY)
// =========================
router.post(
  "/book",
  authMiddleware,
  schedulerController.bookMeeting
);

// =========================
// 🔥 NEW: BOOK MEETING FOR ALL (TOP SLOTS)
// =========================
router.post(
  "/book-all",
  authMiddleware,
  schedulerController.bookMeetingForAll
);

// =========================
// 🔥 GET ALL MEETINGS
// =========================
router.get(
  "/meetings",
  authMiddleware,
  schedulerController.getMeetings
);

// =========================
// 🔥 DELETE MEETING
// =========================
router.delete(
  "/meetings/:id",
  authMiddleware,
  schedulerController.deleteMeeting
);

module.exports = router;