const express = require("express");
const router = express.Router();

const facultyController = require("../controllers/facultyController");

// ✅ ONLY ROUTES (NO LOGIC)

// GET all faculty
router.get("/", facultyController.getAllFaculty);

// GET single faculty
router.get("/:id", facultyController.getFacultyById);

// DELETE faculty
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;