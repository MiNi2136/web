import React, { useState } from 'react';
import { updateAttendanceMarks } from '../services/api';

const AttendanceMarksUpdater = ({ sessionId }) => {
  const [marksData, setMarksData] = useState({}); // define shape based on backend needs
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAttendanceMarks(sessionId, marksData);
      setStatus('Attendance marks updated successfully.');
    } catch (err) {
      setStatus('Failed to update attendance marks.');
    }
  };

  // You can create a form here to update marksData
  return (
    <div>
      <h3>Update Attendance Marks for Session {sessionId}</h3>
      {/* Add form inputs here */}
      <form onSubmit={handleSubmit}>
        {/* Example input */}
        {/* <input type="number" name="marks" onChange={handleChange} /> */}
        <button type="submit">Update</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default AttendanceMarksUpdater;
