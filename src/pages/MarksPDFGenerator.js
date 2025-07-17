import React, { useState } from 'react';
import { generateMarksReportPDF } from '../services/api';

const MarksPDFGenerator = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await generateMarksReportPDF(courseId);

      // Create blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `marks_report_course_${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to generate PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download Marks Report PDF'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MarksPDFGenerator;
