import express from 'express';
const router = express.Router();
const auth = require('../middleware/JWT');
const Session = require('../model/Session');
const Student = require('../model/Student');
const Course = require('../model/Course');

// Update attendance marks
router.put('/attendance/:sessionId', auth, async (req, res) => {
  try {
    const { attendanceMarks } = req.body;
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    attendanceMarks.forEach(({ studentId, marks }) => {
      const record = session.attendance.find(a => a.student.toString() === studentId);
      if (record) record.attendanceMarks = marks;
    });

    await session.save();
    res.json({ message: 'Attendance marks updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
