import express from "express";
import { generateAttendanceReport, generateMarksReport } from "../controllers/ReportsController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Only teachers can access these report routes
router.get(
  "/attendance/:courseId",
  auth,
  authorize("teacher"), // or ['teacher'] if you want array syntax
  generateAttendanceReport
);

router.get(
  "/marks/:courseId",
  auth,
  authorize("teacher"),
  generateMarksReport
);

export default router;
