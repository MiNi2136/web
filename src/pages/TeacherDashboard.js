import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teacher courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/courses");
      // Handle both: { courses: [...] } or direct array response
      setCourses(res.data.courses || res.data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="teacher-dashboard">
      <h2>Teacher Dashboard - Manage Courses</h2>

      <Link
        to="/courses/create"
        style={{ marginBottom: "1rem", display: "inline-block" }}
      >
        ➕ Create New Course
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course._id}>
              <strong>{course.name}</strong> ({course.code || "No code"})
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;
