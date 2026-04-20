const axios = require("axios");
const FormData = require("form-data");
const Faculty = require("../models/Faculty");

// =========================
// 🔥 AUTO EMAIL GENERATOR
// =========================
const generateEmail = (name) => {
  return (
    "yourmail+" +
    name.toLowerCase().replace(/\s+/g, "") +
    "@gmail.com"
  );
};

// =========================
// 🔥 FIXED PARSER (COLUMN BASED)
// =========================
function extractTimetable(text) {
  const lines = text.split("\n");

  const timetable = [];

  const timeSlots = [
    "09:00-09:50",
    "10:00-10:50",
    "11:00-11:50",
    "12:00-12:50",
    "13:00-13:50",
    "14:00-14:50",
    "15:00-15:50",
    "16:00-17:30"
  ];

  const validDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  for (let line of lines) {
    const trimmed = line.trim();

    for (let day of validDays) {
      if (trimmed.toLowerCase().startsWith(day.toLowerCase())) {

        const rest = trimmed.replace(new RegExp(day, "i"), "").trim();

        if (!rest) continue;

        // 🔥 KEY FIX: split by MULTIPLE SPACES (column alignment)
        const columns = rest.split(/\s{2,}/);

        for (let i = 0; i < timeSlots.length; i++) {
          const cell = columns[i];

          // only mark busy if actual subject exists
          if (cell && cell.trim() !== "") {
            timetable.push({
              day,
              time: timeSlots[i]
            });
          }
        }
      }
    }
  }

  return timetable;
}

// =========================
// 🚀 MAIN CONTROLLER
// =========================
exports.uploadTimetable = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ FILE RECEIVED");

    // =========================
    // 🔥 STEP 1: Upload PDF
    // =========================
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const uploadRes = await axios.post(
      "https://api.pdf.co/v1/file/upload",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.PDFCO_API_KEY,
        },
      }
    );

    const fileUrl = uploadRes.data.url;
    console.log("📁 Uploaded URL:", fileUrl);

    // =========================
    // 🔥 STEP 2: Convert PDF → TEXT
    // =========================
    const convertRes = await axios.post(
      "https://api.pdf.co/v1/pdf/convert/to/text",
      { url: fileUrl },
      {
        headers: {
          "x-api-key": process.env.PDFCO_API_KEY,
        },
      }
    );

    const textFileUrl = convertRes.data.url;
    const textRes = await axios.get(textFileUrl);
    const text = textRes.data;

    console.log("📄 TEXT EXTRACTED");

    // =========================
    // 🔍 PARSE BASIC DETAILS
    // =========================
    const nameMatch = text.match(/Faculty Name:\s*(.*)/i);
    const roleMatch = text.match(/Role:\s*(.*)/i);
    const deptMatch = text.match(/Department:\s*(.*)/i);

    const name = nameMatch ? nameMatch[1].trim() : "Unknown";
    const role = roleMatch ? roleMatch[1].trim() : "Assistant Professor";
    const department = deptMatch ? deptMatch[1].trim() : "Unknown";

    console.log("👤 Parsed:", { name, role, department });

    // =========================
    // 🔥 PARSE TIMETABLE (FIXED)
    // =========================
    const timetable = extractTimetable(text);

    console.log("📅 FINAL TIMETABLE:", timetable);

    // =========================
    // 🔥 SAVE / UPDATE
    // =========================
    let faculty = await Faculty.findOne({ name });

    if (faculty) {
      faculty.department = department;
      faculty.role = role;
      faculty.pdfUrl = fileUrl;
      faculty.timetable = timetable;

      if (!faculty.email) {
        faculty.email = generateEmail(name);
      }

      await faculty.save();
    } else {
      faculty = new Faculty({
        name,
        email: generateEmail(name),
        department,
        role,
        pdfUrl: fileUrl,
        timetable
      });

      await faculty.save();
    }

    console.log("💾 Faculty Saved:", faculty.name);

    res.json({
      success: true,
      faculty
    });

  } catch (err) {
    console.error("❌ ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Upload failed" });
  }
};