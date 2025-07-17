import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseList from "./pages/Courselist"; // make sure filename matches exactly
import CreateCourse from "./pages/CreateCourse";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/teacher-dashboard" replace />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/teacher-dashboard"
          element={token ? <TeacherDashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/courses"
          element={token ? <CourseList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/courses/create"
          element={token ? <CreateCourse /> : <Navigate to="/" replace />}
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
