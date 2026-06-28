import express from 'express';
import {
  applyToJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  rankJobCandidates
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('candidate'), upload.single('resume'), applyToJob)
  .get(protect, getApplications);

router.route('/:id')
  .get(protect, getApplicationById);

router.route('/:id/status')
  .put(protect, authorize('recruiter', 'admin'), updateApplicationStatus);

router.route('/job/:jobId/rank')
  .post(protect, authorize('recruiter', 'admin'), rankJobCandidates);

export default router;
