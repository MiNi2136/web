// controllers/MarksController.js

import Marks from "../models/Marks.js";

// ➡️ Add CT marks
export const addCTMarks = async (req, res) => {
  try {
    const { studentId, courseId, ctNumber, marks, maxMarks } = req.body;

    let mark = await Marks.findOne({ student: studentId, course: courseId });

    if (!mark) {
      mark = new Marks({ student: studentId, course: courseId, ct: [] });
    }

    mark.ct.push({ ctNumber, marks, maxMarks });
    await mark.save();

    res.status(200).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➡️ Add assignment marks
export const addAssignmentMarks = async (req, res) => {
  try {
    const { studentId, courseId, name, marks, maxMarks } = req.body;

    let mark = await Marks.findOne({ student: studentId, course: courseId });

    if (!mark) {
      mark = new Marks({ student: studentId, course: courseId, assignments: [] });
    }

    mark.assignments.push({ name, marks, maxMarks });
    await mark.save();

    res.status(200).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➡️ Fetch marks for student-course
export const getMarks = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const mark = await Marks.findOne({ student: studentId, course: courseId })
      .populate("student", "name email")
      .populate("course", "name code");
    if (!mark) return res.status(404).json({ message: "Marks not found" });

    res.status(200).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➡️ Edit marks (CT or assignment)
export const editMarks = async (req, res) => {
  try {
    const { markId, updatedFields } = req.body;
    const mark = await Marks.findByIdAndUpdate(markId, updatedFields, { new: true });
    res.status(200).json(mark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
