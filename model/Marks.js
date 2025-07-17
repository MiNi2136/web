import mongoose from "mongoose";
const { Schema } = mongoose;

// Sub-schema for CT (Class Test) marks
const ctSchema = new Schema({
  ctNumber: { type: Number, required: true },   // e.g. CT1, CT2
  marks: { type: Number, required: true },      // Marks obtained
  maxMarks: { type: Number, required: true },   // Maximum marks possible
}, { _id: false });  // Prevent creating _id for each subdocument

// Sub-schema for Assignment marks
const assignmentSchema = new Schema({
  name: { type: String, required: true },       // Assignment name or title
  marks: { type: Number, required: true },      // Marks obtained
  maxMarks: { type: Number, required: true },   // Maximum marks possible
}, { _id: false });

// Main Marks schema for a student-course pair
const marksSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  ct: [ctSchema],           // Array of CT results
  assignments: [assignmentSchema],  // Array of assignments
}, {
  timestamps: true  // Optional: Adds createdAt and updatedAt timestamps
});

const Marks = mongoose.model("Marks", marksSchema);

export default Marks;
