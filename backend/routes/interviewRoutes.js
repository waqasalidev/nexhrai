import express from 'express';
import {
  scheduleInterview,
  getInterviews,
  updateInterview
} from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('recruiter', 'admin'), scheduleInterview)
  .get(protect, getInterviews);

router.route('/:id')
  .put(protect, authorize('recruiter', 'admin'), updateInterview);

export default router;
