const Faculty = require("../models/Faculty");
const Timetable = require("../models/Timetable");

// =========================
// GET ALL FACULTY
// =========================
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    console.log("📡 Sending faculty:", faculty.length);
    res.json(faculty);
  } catch (err) {
    res.status(500).json(err);
  }
};

// =========================
// GET SINGLE FACULTY
// =========================
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    res.json(faculty);
  } catch (err) {
    res.status(500).json(err);
  }
};

// =========================
// DELETE FACULTY
// =========================
exports.deleteFaculty = async (req, res) => {
  try {
    const id = req.params.id;

    await Timetable.deleteMany({ faculty: id });
    await Faculty.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};