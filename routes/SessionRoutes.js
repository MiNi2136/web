import { Router } from "express";
const router = Router();

import SessionController from "../controllers/SessionController.js";
import JWT from "../middleware/JWT.js";
import upload from "../middleware/Multer.js";

// Create a new session (teacher only)
router.post("/", JWT.verifyToken, SessionController.CreateNewSession);

// Get all sessions of the logged-in teacher
router.get("/", JWT.verifyToken, SessionController.GetAllTeacherSessions);

// Get QR code URL for a session (pass sessionId in query or body)
router.post("/getQR", JWT.verifyToken, SessionController.GetQR);

// Student attends a session with image upload
router.post("/attend", JWT.verifyToken, upload.single("image"), SessionController.AttendSession);

// Get all sessions attended by logged-in student
router.get("/student", JWT.verifyToken, SessionController.GetStudentSessions);

export default router;
