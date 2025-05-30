import express from 'express';
import { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} from '../controllers/notification.controller.js';
import { extractInfo } from '../middleware/extractInfo.js';
const router = express.Router();

// Get notifications for current user
router.get('/',extractInfo ,getUserNotifications);
// Mark notification as read
router.put('/:id/read', markAsRead);
// Mark all notifications as read
router.put('/read-all',extractInfo, markAllAsRead);
// Delete a notification
router.delete('/:id', deleteNotification);

export default router;