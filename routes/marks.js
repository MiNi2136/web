// routes/marks.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/auth.js';
import { addCTMarks, getStudentSessions } from '../controllers/MarksController.js';

const router = express.Router();

router.post('/ct', auth, authorize('teacher'), addCTMarks);
router.get('/my-sessions', auth, authorize('student'), getStudentSessions);

export default router;
