import Notification from '../models/notification.model.js';
import { sendEmail } from '../services/email.service.js';
import { publishMessage } from '../services/rabbitmq.service.js';

// Constants for notification types and target user types
const NOTIFICATION_TYPES = {
  TEACHER_ADDED: 'TEACHER_ADDED',
  COURSE_UPDATE: 'COURSE_UPDATE',
  NEW_ASSIGNMENT: 'NEW_ASSIGNMENT',
  ASSIGNMENT_COMPLETED: 'ASSIGNMENT_COMPLETED'
};

const TARGET_USER_TYPES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  TEACHER: 'teacher'
};

// Helper function to parse message content
const parseMessageContent = (msg) => {
  try {
    return typeof msg.content === 'object' 
      ? JSON.parse(msg.content.toString()) 
      : msg;
  } catch (error) {
    throw new Error('Invalid message format');
  }
};

// Helper function to validate notification data
const validateNotificationData = ({ type, title, message, targetUsers }) => {
  if (!type || !title || !message) {
    throw new Error('Missing required fields: type, title, or message');
  }
  
  if (!targetUsers) {
    throw new Error('targetUsers is required');
  }
};

// Helper function to create and save notification
const createNotificationRecord = async (userId, type, title, message, data = {}) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    data
  });
  
  await notification.save();
  return notification;
};

// Helper function to emit socket notification
const emitSocketNotification = (userId, notification) => {
  const io = global.io;
  if (io) {
    io.to(userId.toString()).emit('new_notification', notification);
  }
};

// Helper function to send email if user has email notifications enabled
const sendEmailNotification = async (user, title, message) => {
  if (user.emailNofification) {
    try {
      await sendEmail(user.email, title, message);
      console.log(`Email sent to: ${user.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
    }
  }
};

// Handle special notification types
const handleSpecialNotifications = async (type, data, title, message) => {
  switch (type) {
    case NOTIFICATION_TYPES.TEACHER_ADDED:
      await sendEmail(data.email, title, message);
      return { success: true, handled: true };
    default:
      return { handled: false };
  }
};

// Handle group notifications (students, admin, teachers)
const handleGroupNotifications = async (targetUsers, type, title, message, data) => {
  try {
    const users = await publishMessage('auth.get.students', { targetUsers,data });
    console.log(`Retrieved ${users.length} users for group notification`);
    
    const notifications = [];
    
    for (const user of users) {
      const notification = await createNotificationRecord(
        user._id, type, title, message, data
      );
      
      notifications.push(notification);
      emitSocketNotification(user._id, notification);
      await sendEmailNotification(user, title, message);
    }
    
    console.log(`Sent ${notifications.length} group notifications`);
    return { success: true, count: notifications.length };
  } catch (error) {
    console.error('Error handling group notifications:', error);
    throw error;
  }
};

// Handle individual user notifications
const handleIndividualNotifications = async (targetUsers, type, title, message, data) => {
  try {
    const notifications = [];
    
    for (const userId of targetUsers) {
      const notification = await createNotificationRecord(
        userId, type, title, message, data
      );
      
      notifications.push(notification);
      emitSocketNotification(userId, notification);
      
      // Get user info for email notification
      try {
        const user = await publishMessage('auth.get.user', { userId });
        if (user) {
          await sendEmailNotification(user, title, message);
        }
      } catch (error) {
        console.error(`Failed to get user ${userId} for email notification:`, error);
      }
    }
    
    console.log(`Sent ${notifications.length} individual notifications`);
    return { success: true, count: notifications.length };
  } catch (error) {
    console.error('Error handling individual notifications:', error);
    throw error;
  }
};

// Main notification creation function
export const createNotification = async (msg) => {
  try {
    console.log('Processing notification message:', msg);
    
    const content = parseMessageContent(msg);
    const { type, title, message, targetUsers, data } = content;
    
    validateNotificationData({ type, title, message, targetUsers });
    
    console.log(`Processing notification: ${type} - ${title}`);
    
    // Handle special notification types
    const specialResult = await handleSpecialNotifications(type, data, title, message);
    if (specialResult.handled) {
      return specialResult;
    }
    
    // Handle group notifications
    if (Object.values(TARGET_USER_TYPES).includes(targetUsers)) {
      return await handleGroupNotifications(targetUsers, type, title, message, data);
    }
    
    // Handle individual user notifications
    if (Array.isArray(targetUsers)) {
      return await handleIndividualNotifications(targetUsers, type, title, message, data);
    }
    
    throw new Error('Invalid targetUsers parameter. Must be a group type or array of user IDs.');
    
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// Get notifications for current user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }),
      Notification.countDocuments({ userId, read: false })
    ]);
    
    res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this notification' 
      });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking notification as read', 
      error: error.message 
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'All notifications marked as read',
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking all notifications as read', 
      error: error.message 
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User authentication required' 
      });
    }
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    // Optional: Add authorization check
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this notification' 
      });
    }
    
    await notification.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
};