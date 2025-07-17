import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSubSchema = new Schema({
  session_id: { type: String, required: true },
  date: { type: String, required: true },       // Or Date type if preferred
  time: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  distance: { type: String, required: true },
  radius: { type: String, required: true },
  student_location: { type: String, required: true },
  image: { type: String, required: true },
}, { _id: false }); // No _id for subdocument if not needed

const studentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  pno: { type: String, required: true, trim: true },
  dob: { type: String, required: true },  // Or Date if you prefer
  password: { type: String, required: true, minlength: 6 },
  sessions: [sessionSubSchema],
}, { timestamps: true });

 const Student = mongoose.model("Student", studentSchema);
export default Student;


