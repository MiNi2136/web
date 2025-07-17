import axios from "axios";

// Create Axios instance with baseURL from env and credentials enabled if needed
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000", // fallback if env not set
  withCredentials: true, // include cookies if your backend uses them
});

// Add interceptor to attach JWT token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const login = (email, password) =>
  api.post("/users/login", { email, password });

export const signup = (formData) =>
  api.post("/users/signup", formData);

// Marks APIs
export const getStudentMarks = (studentId, courseId) =>
  api.get(`/marks/${studentId}/${courseId}`);

export const addCTMarks = (ctData) =>
  api.post("/marks/ct", ctData);

export const addAssignmentMarks = (assignmentData) =>
  api.post("/marks/assignment", assignmentData);

export const editMarks = (markId, updatedFields) =>
  api.put("/marks/edit", { markId, updatedFields });

// Reports APIs
export const generateMarksReportPDF = (courseId) =>
  api.get(`/reports/marks/${courseId}`, {
    responseType: "blob",
  });

// Attendance marks update (optional)
export const updateAttendanceMarks = (sessionId, data) =>
  api.put(`/attendance/${sessionId}`, data);

export default api;
