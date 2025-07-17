import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateAttendancePDF = (fileName, attendanceData, courseName, classDate) => {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join("public", "pdfs", fileName);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text(`${courseName} - Attendance Report`, { align: "center" });
  doc.fontSize(12).text(`Date: ${classDate}`, { align: "center" });
  doc.moveDown();

  // Table header
  doc.fontSize(12).text("Roll", 50, doc.y, { continued: true });
  doc.text("Name", 150, doc.y, { continued: true });
  doc.text("Status", 350, doc.y);
  doc.moveDown();

  // Table rows
  attendanceData.forEach(({ roll, name, status }) => {
    doc.text(roll, 50, doc.y, { continued: true });
    doc.text(name, 150, doc.y, { continued: true });
    doc.text(status, 350, doc.y);
  });

  doc.end();

  return filePath;
};
