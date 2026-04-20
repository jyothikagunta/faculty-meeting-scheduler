const express = require("express");
const router = express.Router();

const {
  getNotifications,
  clearNotifications,
} = require("../controllers/notificationController");

// GET
router.get("/", getNotifications);

// OPTIONAL DELETE
router.delete("/", clearNotifications);

module.exports = router;