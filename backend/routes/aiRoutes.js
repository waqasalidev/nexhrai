import express from 'express';
import {
  analyzeResumeOnly,
  generateCoverLetterOnly,
  generateInterviewPrep,
  getCareerAdvice,
  generateJobDescription,
  checkATSScore
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze-resume', protect, upload.single('resume'), analyzeResumeOnly);
router.post('/check-ats', protect, checkATSScore);
router.post('/generate-cover-letter', protect, upload.single('resume'), generateCoverLetterOnly);
router.post('/interview-prep', protect, upload.single('resume'), generateInterviewPrep);
router.post('/career-advice', protect, upload.single('resume'), getCareerAdvice);
router.post('/generate-job-description', protect, generateJobDescription);

export default router;
