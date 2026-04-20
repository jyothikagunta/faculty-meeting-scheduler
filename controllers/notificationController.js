const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLEAR ALL (optional)
exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany();
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};