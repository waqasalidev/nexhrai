import express from 'express';
import {
  updateUserProfile,
  getDashboardMetrics,
  getAllUsers,
  deleteUser,
  getUserNotifications,
  markNotificationRead
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.get('/dashboard', protect, getDashboardMetrics);
router.get('/notifications', protect, getUserNotifications);
router.put('/notifications/:id', protect, markNotificationRead);

// Admin-only pathways
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
