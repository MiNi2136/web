import React, { useEffect, useState } from 'react';
import { getStudentMarks } from '../services/api';

const StudentMarks = ({ studentId, courseId }) => {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMarks() {
      try {
        const res = await getStudentMarks(studentId, courseId);
        setMarks(res.data);
      } catch (err) {
        setError('Failed to load marks');
      } finally {
        setLoading(false);
      }
    }
    if (studentId && courseId) {
      fetchMarks();
    }
  }, [studentId, courseId]);

  if (loading) return <p>Loading marks...</p>;
  if (error) return <p>{error}</p>;
  if (!marks) return <p>No marks found.</p>;

  return (
    <div>
      <h2>Marks for Course {courseId}</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Title / CT #</th>
            <th>Marks</th>
            <th>Max Marks</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark) => (
            <tr key={mark._id}>
              <td>{mark.type}</td>
              <td>{mark.name || `CT ${mark.ctNumber}`}</td>
              <td>{mark.marks}</td>
              <td>{mark.maxMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentMarks;
