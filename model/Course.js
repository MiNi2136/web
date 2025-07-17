import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  semester: String,
  year: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
});

const Course = mongoose.model('Course', CourseSchema);

export default Course;  // <-- default export
