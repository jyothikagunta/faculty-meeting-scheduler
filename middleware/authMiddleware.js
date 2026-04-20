const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("🔐 HEADER RECEIVED:", authHeader);

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    console.log("🔐 TOKEN EXTRACTED:", token);

    // ❌ No token after split
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ TOKEN VERIFIED:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("❌ AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token"
    });
  }
};