import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  regno: { type: String, trim: true },
  image: { type: String, trim: true },  // path to uploaded image
  ip: { type: String, trim: true },
  date: { type: Date },
  student_email: { type: String, trim: true, lowercase: true },
  location: { type: String, trim: true },
  distance: { type: String, trim: true },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  session_id: { type: String, trim: true },
  date: { type: Date },
  time: { type: String, trim: true },
  name: { type: String, trim: true },
  duration: { type: String, trim: true },
  location: { type: String, trim: true },
  radius: { type: String, trim: true },
  attendance: [attendanceSchema]
}, { _id: false });

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  pno: { type: String, required: true, trim: true },
  dob: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  sessions: [sessionSchema]
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", teacherSchema);
