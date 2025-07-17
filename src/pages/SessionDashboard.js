import React, { useState, useEffect } from "react";
import api from "../services/api"; // ✅ Using your global api instance
import "./SessionDashboard.css";

const SessionDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    radius: "",
  });

  // Fetch teacher's courses on mount
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses/teacher");
        setCourses(res.data);
        if (res.data.length > 0) setSelectedCourse(res.data[0]._id);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    }
    fetchCourses();
  }, []);

  // Fetch sessions for selected course
  useEffect(() => {
    if (!selectedCourse) return;

    async function fetchSessions() {
      try {
        const res = await api.get("/sessions", {
          params: { courseId: selectedCourse }, // If your backend expects query param
        });
        setSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      }
    }
    fetchSessions();
  }, [selectedCourse]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        courseId: selectedCourse,
      };
      await api.post("/sessions", payload); // ✅ Matches your Create Session API
      alert("Session created successfully");

      // Refresh sessions list
      const res = await api.get("/sessions", {
        params: { courseId: selectedCourse },
      });
      setSessions(res.data.sessions || []);

      // Reset form
      setFormData({
        name: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        radius: "",
      });
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Failed to create session");
    }
  };

  return (
    <div className="session-dashboard">
      <h2>Session Dashboard</h2>

      {/* Select course */}
      <label>
        Select Course:{" "}
        <select
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </label>

      {/* Create session form */}
      <h3>Create New Session</h3>
      <form onSubmit={handleCreateSession} className="create-session-form">
        <input
          type="text"
          name="name"
          placeholder="Session Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleInputChange}
          min={1}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="radius"
          placeholder="Radius (meters)"
          value={formData.radius}
          onChange={handleInputChange}
          min={0}
          required
        />
        <button type="submit">Create Session</button>
      </form>

      {/* Sessions list */}
      <h3>Sessions for Selected Course</h3>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="session-list">
          {sessions.map((s) => (
            <li key={s._id}>
              <strong>{s.name}</strong> —{" "}
              {new Date(s.date).toLocaleDateString()} at {s.time} — Duration:{" "}
              {s.duration} min — Location: {s.location} (Radius: {s.radius}m)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionDashboard;
