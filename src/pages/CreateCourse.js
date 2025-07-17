import React, { useState } from "react";
import api from "../services/api";
import "./CreateCourse.css";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Course name is required");
    setLoading(true);
    try {
      await api.post("/courses", { name, code, description, semester, year });
      alert("Course created successfully!");
      navigate("/teacher-dashboard"); // Redirect to teacher dashboard after creation
    } catch (err) {
      alert("Failed to create course: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Course Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <input
          type="text"
          placeholder="Semester (e.g., Spring, Fall)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min={2000}
          max={2100}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
