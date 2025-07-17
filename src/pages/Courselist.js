import React, { useState, useEffect } from "react";
import api from "../services/api";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/courses");
        setCourses(res.data.courses || res.data);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      alert("Failed to delete course");
    }
  };

  return (
    <div>
      <h2>My Courses</h2>
      {loading && <p>Loading courses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && courses.length === 0 && <p>No courses found.</p>}
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <strong>{course.name}</strong> ({course.code || "No code"})
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => alert("Edit feature coming soon!")}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => handleDelete(course._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
