import express from 'express';
import { 
  trackActivity, 
  getUserCourseProgress, 
  getUserDashboardAnalytics,
  getAdminAnalytics,
} from '../controllers/analytics.controller.js';
import { extractInfo } from '../middleware/extractInfo.js';
const router = express.Router();
router.use(extractInfo)
// Track user activity
router.post('/track', trackActivity);
// Get user progress for a specific course
router.get('/progress/:courseId', getUserCourseProgress);
// Get user dashboard analytics
router.get('/dashboard', getUserDashboardAnalytics);
// Get admin analytics dashboard (admin/teacher only)
router.get('/admin', getAdminAnalytics);

export default router;