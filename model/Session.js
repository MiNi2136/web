import mongoose from "mongoose";
const { Schema } = mongoose;

// Sub-schema for each attendance record (student attendance per session)
const attendanceSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  image: { type: String, required: true },  // Image URL or path for attendance proof
  ip: { type: String, required: true },
  location: { type: String, required: true },
  distance: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { _id: false });

// Session schema
const sessionSchema = new Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  sessionId: { type: String, required: true, unique: true },  // Unique session code/id for QR
  name: { type: String, required: true },    // Session name (e.g. "CT 1", "Lecture 3")
  date: { type: Date, required: true },
  time: { type: String, required: true },    // Time string (or you can store Date type if needed)
  duration: { type: String, required: true }, // Duration in minutes or hh:mm
  location: { type: String, required: true }, // Location string
  radius: { type: String, required: true },   // Allowed radius for attendance
  attendance: [attendanceSchema],              // Array of student attendance
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
