const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadTimetable } = require("../controllers/timetableController");

router.post("/upload", upload.single("file"), uploadTimetable); // ✅ MUST BE "file"

module.exports = router;