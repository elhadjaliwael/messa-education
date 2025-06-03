import Notification from '../models/notification.model.js';
import { sendEmail } from '../services/email.service.js';
import { publishMessage } from '../services/rabbitmq.service.js';

// Create a new notification from RabbitMQ message
export const createNotification = async (msg) => {
  try {
    // Parse message content if it's a Buffer
    console.log("message",msg)
    const content = typeof msg.content === 'object' ? 
      JSON.parse(msg.content.toString()) : msg;
    
    const { type, title, message, targetUsers, data } = content;
    console.log('Processing notification:', type, title, message, targetUsers);
    
    // Get the global io instance
    const io = global.io;
    if(type === 'TEACHER_ADDED'){
      sendEmail(data.email, title, message)
      return { success: true };
    }
    // If targetUsers is 'all', notify all users
    if (targetUsers === 'students' || targetUsers === 'admin' || targetUsers === 'teachers') {
      // Replace HTTP request with RabbitMQ message
      const users = await publishMessage('auth.get.students', {targetUsers});
      console.log('Retrieved users:', users.length);
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
        console.log(user._id.toString())
        if (io) {
          console.log('waaa')
          io.to(user._id.toString()).emit('new_notification', notification);
        }
        
        if (user.emailNofification) {
          console.log("Sending email to:", user.email);
          sendEmail(user.email, title, message);
        }
      }
      
      console.log(`Sent ${notifications.length} notifications to all users`);
      return { success: true, count: notifications.length };
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
        
        if (io) {
          io.to(userId.toString()).emit('new_notification', notification);
        }
        
        try {
          // Use RabbitMQ to get user info instead of direct HTTP call
          const user = await publishMessage('auth.get.user', { userId });
          
          if (user && user.emailNofification) {
            console.log("Sending email to specific user:", user.email);
            sendEmail(user.email, title, message);
          }
        } catch (error) {
          console.error(`Failed to get user ${userId} for email notification:`, error);
        }
      }
      
      console.log(`Sent ${notifications.length} notifications to specific users`);
      return { success: true, count: notifications.length };
    }
    
    console.log('Invalid targetUsers parameter');
    return { success: false, error: 'Invalid targetUsers parameter' };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

// Get notifications for current user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const query = { userId };
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
    
    const unreadCount = await Notification.countDocuments({userId,read : false});
    res.status(200).json({
      notifications,
      unreadCount
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
    const userId = req.user.id;
    
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