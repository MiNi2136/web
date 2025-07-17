import PDFDocument from "pdfkit";
import Course from "../models/Course.js";
import Attendance from "../models/Attendance.js"; // Adjust your model path
import Marks from "../models/Marks.js";           // Adjust your model path
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

// Helper: generate attendance PDF and pipe to response
const createAttendancePDF = (doc, attendanceData, courseName, classDate) => {
  doc.fontSize(20).text(`Attendance Report for ${courseName}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${classDate}`);
  doc.moveDown();

  // Table headers
  doc.font("Helvetica-Bold");
  doc.text("Roll", 50, doc.y, { continued: true, width: 100 });
  doc.text("Name", 150, doc.y, { continued: true, width: 200 });
  doc.text("Status", 350, doc.y);
  doc.moveDown();
  doc.font("Helvetica");

  // Rows
  attendanceData.forEach(({ roll, name, status }) => {
    doc.text(roll, 50, doc.y, { continued: true, width: 100 });
    doc.text(name, 150, doc.y, { continued: true, width: 200 });
    doc.text(status, 350, doc.y);
    doc.moveDown();
  });

  doc.end();
};

export const generateAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch course info
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Fetch attendance data (customize as per your schema)
    // Example: all attendance docs for this course, populate student info
    const attendanceRecords = await Attendance.find({ course: courseId })
      .populate("student", "roll name")
      .lean();

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    // Map data to printable format
    const attendanceData = attendanceRecords.map(record => ({
      roll: record.student.roll,
      name: record.student.name,
      status: record.status,  // e.g., "Present" or "Absent"
    }));

    const classDate = new Date().toLocaleDateString();

    // Set response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance_${courseId}_${Date.now()}.pdf`
    );

    // Create PDF document and pipe to response
    const doc = new PDFDocument();
    doc.pipe(res);

    createAttendancePDF(doc, attendanceData, course.name, classDate);

    // No need to call res.end() because doc.end() ends the stream
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ message: "Error generating attendance report" });
  }
};

export const generateMarksReport = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Fetch course info
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Fetch marks data (customize as per your schema)
    const marksRecords = await Marks.find({ course: courseId })
      .populate("student", "roll name")
      .lean();

    if (!marksRecords.length) {
      return res.status(404).json({ message: "No marks records found" });
    }

    // TODO: implement PDF generation for marks similarly
    // For now, just send JSON (replace with PDF generation logic)
    res.json({
      message: "Marks report generation not implemented yet",
      course: course.name,
      recordsCount: marksRecords.length,
    });
  } catch (err) {
    console.error("Marks report error:", err);
    res.status(500).json({ message: "Error generating marks report" });
  }
};
