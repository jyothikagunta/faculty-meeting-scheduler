const express = require("express");
const router = express.Router();

// ✅ IMPORTS FIRST
const authMiddleware = require("../middleware/authMiddleware");
const topSlotsController = require("../controllers/topSlotsController");

// =========================
// 🔥 TOP SLOTS ROUTE
// =========================
router.get("/", authMiddleware, topSlotsController.getTopSlots);

module.exports = router;