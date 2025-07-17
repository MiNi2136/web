import express from "express";
import { auth } from "../middleware/auth.js";
import { getTeacherCourses, createCourse } from "../controllers/CourseController.js";

const router = express.Router();

router.get("/", auth, getTeacherCourses);
router.post("/", auth, createCourse);

export default router;
