import Notification from '../models/notification.model.js';
import axios from 'axios';
import { sendEmail } from '../services/email.service.js';

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { type, title, message, targetUsers, data } = req.body;
    const io = req.app.get('io');
    
    // If targetUsers is 'all', notify all users
    if (targetUsers === 'all') {
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/users`);
      
      const users = response.data.users;
      console.log(users)
      const notifications = [];
      
      for (const user of users) {
        const notification = new Notification({
          userId: user._id,
          type,
          title,
          message,
          data: data || {}
        });
        
        await notification.save();
        notifications.push(notification);
        io.to(user._id.toString()).emit('notification', notification);
        
        if (user.emailNofification) {
          console.log("email")
          sendEmail(user.email, title, message);
        }
      }
      
      return res.status(201).json({ message: 'Notifications sent to all users', count: notifications.length });
    }
    
    if (Array.isArray(targetUsers)) {
      const notifications = [];
      
      for (const userId of targetUsers) {
        const notification = new Notification({
          userId,
          type,
          title,
          message,
          data: data || {}
        });
        
        await notification.save();
        notifications.push(notification);
        
        io.to(userId.toString()).emit('notification', notification);
        
        try {
          const userResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/users/${userId}`);
          console.log(userResponse.data.user)
          if (userResponse.data.user.emailNofification) {
            console.log("yess")
            sendEmail(userResponse.data.user.email, title, message);
          }
        } catch (error) {
          console.error(`Failed to get user ${userId} for email notification:`, error);
        }
      }
      
      return res.status(201).json({ message: 'Notifications sent to specific users', count: notifications.length });
    }
    
    return res.status(400).json({ message: 'Invalid targetUsers parameter' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Get notifications for current user
export const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false, userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const query = { userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    
    res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this notification' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    await Notification.updateMany(
      { userId: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await notification.deleteOne();
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};