import { create } from 'zustand';
import { axiosPrivate } from '@/api/axios';
import { io } from 'socket.io-client';

const useNotificationStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  // Initialize notification socket
  initializeNotificationSocket: (auth) => {
    let { socket } = get();
  
    if (socket) {
      // Always disconnect the previous one
      console.log("⚠️ Existing socket found, disconnecting...");
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  
    const newSocket = io("http://localhost:3004", {
      path: "/api/notifications/notification-socket",
      withCredentials: true,
      transports: ['websocket'],
      auth: {
        userId: auth.user?.id,
        role: auth.user?.role,
      },
      extraHeaders: {
        authorization: `Bearer ${auth.accessToken}`,
      },
      autoConnect: false,
    });
  
    newSocket.on("connect", () => {
      console.log("✅ Notification socket connected");
      set({ isConnected: true });
    });
  
    newSocket.on("disconnect", () => {
      console.log("❌ Notification socket disconnected");
      set({ isConnected: false });
    });
  
    newSocket.on("connect_error", (err) => {
      console.error("⚠️ Connect error:", err.message);
    });
  
    set({ socket: newSocket });
  
    return newSocket;
  },
  
  // Setup notification socket listeners
  setupNotificationSocket: (socket) => {
    if (!socket) return;
    
    
    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      const { notifications, unreadCount } = get();
      console.log("notification received:", notification);
      set({ 
        notifications: [notification, ...notifications],
        unreadCount: unreadCount + 1
      });
    });
    
    // Listen for notification updates
    socket.on('notification_update', (updatedNotification) => {
      const { notifications } = get();
      
      const updatedNotifications = notifications.map(notification => 
        notification.id === updatedNotification.id 
          ? { ...notification, ...updatedNotification } 
          : notification
      );
      
      // Recalculate unread count
      const unreadCount = updatedNotifications.filter(notification => !notification.read).length;
      
      set({ notifications: updatedNotifications, unreadCount });
    });
    
    // Listen for all notifications read event
    socket.on('all_notifications_read', () => {
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      set({ notifications: updatedNotifications, unreadCount: 0 });
    });
  },
  
  // Disconnect socket
  disconnectNotificationSocket: () => {
    const { socket } = get();
    if (socket) {
      console.log("🛑 Disconnecting socket...");
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, isConnected: false });
  },
  
  // Actions
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axiosPrivate.get(`/notifications`);
      const notifications = response.data.notifications;
      const unreadCount = response.data.unreadCount
      
      set({ 
        notifications, 
        unreadCount,
        isLoading: false 
      });
      
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ 
        error: 'Failed to fetch notifications', 
        isLoading: false 
      });
      return [];
    }
  },
  
  markAsRead: async (notificationId) => {
    try {
      await axiosPrivate.put(`/notifications/${notificationId}/read`);
      
      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      // Recalculate unread count
      const unreadCount = updatedNotifications.filter(notification => !notification.read).length;
      
      set({ notifications: updatedNotifications, unreadCount });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },
  
  markAllAsRead: async () => {
    try {
      await axiosPrivate.put('/notifications/read-all');
      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      set({ notifications: updatedNotifications, unreadCount: 0 });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },
  
  addNotification: (notification) => {
    const { notifications, unreadCount } = get();
    
    // Add new notification to the beginning of the array
    const updatedNotifications = [notification, ...notifications];
    
    // Increment unread count if the notification is unread
    const newUnreadCount = notification.read ? unreadCount : unreadCount + 1;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: newUnreadCount
    });
  },
  
  removeNotification: (notificationId) => {
    const { notifications } = get();
    
    // Find the notification to be removed
    const notificationToRemove = notifications.find(n => n.id === notificationId);
    
    // Filter out the notification
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    
    // Update unread count if the removed notification was unread
    const unreadCount = get().unreadCount;
    const newUnreadCount = notificationToRemove && !notificationToRemove.read 
      ? unreadCount - 1 
      : unreadCount;
    
    set({ 
      notifications: updatedNotifications,
      unreadCount: newUnreadCount >= 0 ? newUnreadCount : 0
    });
  },
  // Clear all notifications
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));

export default useNotificationStore;