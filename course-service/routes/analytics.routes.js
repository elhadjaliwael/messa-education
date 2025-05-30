import express from 'express';
import { 
  trackActivity, 
  getUserCourseProgress, 
  getUserDashboardAnalytics,
  getAdminAnalytics,
  getExerciseActivity,
  getQuizzActivity
} from '../controllers/analytics.controller.js';
import { extractInfo } from '../middleware/extractInfo.js';
const router = express.Router();
router.use(extractInfo)
// Track user activity
router.post('/track', trackActivity);
// Get user progress for a specific course
router.get('/progress/:subject', getUserCourseProgress);
router.get('/exercises/:lessonId',getExerciseActivity)
router.get('/quizzes/:lessonId',getQuizzActivity)
// Get user dashboard analytics
router.get('/student/dashboard', getUserDashboardAnalytics);
router.get('/children/:id/progress', getUserDashboardAnalytics);
// Get admin analytics dashboard (admin/teacher only)
router.get('/admin', getAdminAnalytics);

export default router;