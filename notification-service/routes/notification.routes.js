import express from 'express';
import { 
    createNotification, 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
} from '../controllers/notification.controller.js';
const router = express.Router();

// Create a new notification (protected, requires auth)
router.post('/', createNotification);
// Get notifications for current user
router.get('/', getUserNotifications);
// Mark notification as read
router.put('/:id/read', markAsRead);
// Mark all notifications as read
router.put('/read-all', markAllAsRead);
// Delete a notification
router.delete('/:id', deleteNotification);

export default router;