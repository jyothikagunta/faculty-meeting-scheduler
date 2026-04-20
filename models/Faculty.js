const mongoose = require("mongoose");

// =========================
// 🔥 EMAIL GENERATOR
// =========================
const generateEmail = (name) => {
  return (
    "yourmail+" +
    name.toLowerCase().replace(/\s+/g, "") +
    "@gmail.com"
  );
};

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    // ✅ NEW FIELD
    email: {
      type: String,
      unique: true,
      sparse: true
    },

    facultyCode: {
      type: String,
      unique: true,
      sparse: true // ✅ IMPORTANT FIX
    },

    department: {
      type: String,
      default: "Unknown"
    },

    role: {
      type: String,
      enum: [
        "HOD",
        "Professor",
        "Associate Professor",
        "Assistant Professor"
      ],
      default: "Assistant Professor"
    },

    timetable: [
      {
        day: String,
        time: String
      }
    ],

    pdfUrl: {
      type: String
    }
  },
  { timestamps: true }
);

// =========================
// 🔥 AUTO-GENERATE facultyCode + email
// =========================
facultySchema.pre("save", async function () {
  // ✅ facultyCode generation
  if (!this.facultyCode) {
    const count = await mongoose.model("Faculty").countDocuments();
    this.facultyCode = "F" + String(count + 1).padStart(3, "0");
  }

  // ✅ email generation
  if (!this.email && this.name) {
    this.email = generateEmail(this.name);
  }
});

module.exports = mongoose.model("Faculty", facultySchema);