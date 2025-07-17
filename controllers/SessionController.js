import dotenv from "dotenv";
dotenv.config();
import querystring from "querystring";
import { Teacher } from "../model/Teacher.js";
import Student from "../model/Student.js";
import uploadImage from "../middleware/Cloudinary.js";

// Generate QR code URL
function getQR(session_id, email) {
  return `${process.env.CLIENT_URL}/login?${querystring.stringify({ session_id, email })}`;
}

// Calculate distance using Haversine formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkStudentDistance(Location1, Location2) {
  const [lat1, lon1] = Location1.split(",").map(Number);
  const [lat2, lon2] = Location2.split(",").map(Number);
  return haversineDistance(lat1, lon1, lat2, lon2).toFixed(2);
}

// Create new session
async function CreateNewSession(req, res) {
  const { session_id, name, duration, location, radius, date, time } = req.body;
  const tokenData = req.user;

  if (!session_id || !name || !duration || !location || !radius || !date || !time) {
    return res.status(400).json({ message: "All session fields are required" });
  }

  const newSession = {
    session_id,
    date,
    time,
    name,
    duration,
    location,
    radius,
    attendance: [], // initialize attendance as empty array
  };

  try {
    const teacher = await Teacher.findOne({ email: tokenData.email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.sessions.push(newSession);
    await teacher.save();

    res.status(200).json({
      url: getQR(session_id, tokenData.email),
      message: "Session created successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all sessions of a teacher
async function GetAllTeacherSessions(req, res) {
  try {
    const tokenData = req.user;
    const teacher = await Teacher.findOne({ email: tokenData.email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ sessions: teacher.sessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get QR code URL for a session
async function GetQR(req, res) {
  try {
    const tokenData = req.user;
    const { session_id } = req.body;
    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }
    const url = getQR(session_id, tokenData.email);
    res.status(200).json({ url });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Attend session with photo upload & location check
async function AttendSession(req, res) {
  const tokenData = req.user;
  const {
    session_id,
    teacher_email,
    regno,
    ip,           // renamed from IP to ip for consistency
    location,     // renamed from Location to location
    date,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Attendance image is required" });
  }

  if (!session_id || !teacher_email || !regno || !location || !date) {
    return res.status(400).json({ message: "Missing required attendance fields" });
  }

  try {
    let present = false;
    const teacher = await Teacher.findOne({ email: teacher_email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find session by session_id
    const session = teacher.sessions.find(s => s.session_id === session_id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if student already marked present
    present = session.attendance.some(
      student => student.regno === regno || student.student_email === tokenData.email
    );

    if (present) {
      return res.status(200).json({ message: "Attendance already marked" });
    }

    // Upload image to Cloudinary (or your upload service)
    const imageUrl = await uploadImage(req.file.filename);

    const distance = checkStudentDistance(location, session.location);

    // Create attendance record
    const attendanceRecord = {
      regno,
      image: imageUrl,
      date: new Date(date),
      ip,
      student_email: tokenData.email,
      location,
      distance,
    };

    session.attendance.push(attendanceRecord);

    await teacher.save();

    // Update student's sessions array (push session details)
    const session_details = {
      session_id: session.session_id,
      teacher_email: teacher.email,
      name: session.name,
      date: session.date,
      time: session.time,
      duration: session.duration,
      distance,
      radius: session.radius,
      image: imageUrl,
    };

    await Student.findOneAndUpdate(
      { email: tokenData.email },
      { $push: { sessions: session_details } }
    );

    return res.status(200).json({ message: "Attendance marked successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all sessions attended by a student
async function GetStudentSessions(req, res) {
  const tokenData = req.user;
  try {
    const student = await Student.findOne({ email: tokenData.email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ sessions: student.sessions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const SessionController = {
  CreateNewSession,
  GetAllTeacherSessions,
  GetQR,
  AttendSession,
  GetStudentSessions,
};

export default SessionController;
