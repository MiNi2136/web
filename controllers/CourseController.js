import Course from '../model/Course.js';

// Get courses created by the logged-in teacher
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id; // safer fallback
    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized: No teacher ID found" });
    }
    const courses = await Course.find({ teacher: teacherId });
    res.json(courses);
  } catch (error) {
    console.error("Get Teacher Courses Error:", error);
    res.status(500).json({ message: 'Failed to get courses', error: error.message });
  }
};

// Create a new course by the logged-in teacher
export const createCourse = async (req, res) => {
  try {
    const { name, code, description, semester, year } = req.body;
    const teacherId = req.user._id || req.user.id;

    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized: No teacher ID found" });
    }

    // Basic validation (optional, but good)
    if (!name || !code || !description || !semester || !year) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const course = new Course({
      name,
      code,
      description,
      semester,
      year,
      teacher: teacherId,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};
