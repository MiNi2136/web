import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher"); // default role
  const [pno, setPno] = useState(""); // Phone number
  const [dob, setDob] = useState(""); // Date of birth (YYYY-MM-DD)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/users/signup", {
        name,
        email,
        password,
        role,
        pno,
        dob,
      });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />

        {/* Phone number input */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={pno}
          onChange={e => setPno(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />

        {/* Date of birth input */}
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={e => setDob(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />

        {/* Role selector dropdown */}
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
          required
        >
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", width: "100%" }}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
