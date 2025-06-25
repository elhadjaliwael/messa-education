import Message from '../models/messages.js';

// Map to store online users: userId -> socket.id
const onlineUsers = new Map();
// Map to store active rooms
const activeRooms = new Map();
// Map to store group rooms
const groupRooms = new Map();
export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log("a user connected")
    // Extract user info from auth data
    const { userId, role } = socket.handshake.auth;
    if (userId) {
      
      // Store user connection
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.role = role || 'student';
      // Broadcast user status change to all clients
      io.emit('status_change', { userId, status: 'online' });
    }
    
    // Handle joining a conversation room
    socket.on('join_room', ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      // Track active rooms
      if (!activeRooms.has(roomId)) {
        activeRooms.set(roomId, new Set());
      }
      activeRooms.get(roomId).add(socket.userId);
    });
    
    // Handle joining a group room
    socket.on('join_group', ({ groupId }) => {
      if (!groupId) return;
      socket.join(groupId);
      
      // Track group rooms
      if (!groupRooms.has(groupId)) {
        groupRooms.set(groupId, new Set());
      }
      groupRooms.get(groupId).add(socket.userId);
    });
    
    // Handle sending messages
    socket.on('send_message', async (message) => {
      try {
        const { senderId, recipientId, content, timestamp } = message;

        
        // Save message to database
        const newMessage = new Message({
          senderId,
          recipientId,
          content,
          timestamp,
          read: false
        });
        
        await newMessage.save();
        
        // Create room ID (sorted to ensure consistency)
        const roomId = [senderId, recipientId].sort().join('-');
        
        // Emit message to the room
        io.to(roomId).emit('new_message', {
          id: newMessage._id,
          senderId,
          recipientId,
          content,
          timestamp,
          read: false
        });
        
        // If recipient is not in the room but online, notify them separately
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId && (!activeRooms.has(roomId) || !activeRooms.get(roomId).has(recipientId))) {
          io.to(recipientSocketId).emit('new_message', {
            id: newMessage._id,
            senderId,
            recipientId,
            content,
            timestamp,
            read: false
          });
        }
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle sending group messages
    socket.on('send_group_message', async (message) => {
      try {
        const { senderId, groupId, content, timestamp,attachment} = message;
        console.log(attachment)
        // Save message to database with sender role
        const newMessage = new Message({
          senderId,
          groupId,
          content,
          timestamp,
          isGroupMessage: true,
          attachment,
          read: false,
          senderRole: socket.role // Add the sender's role from socket
        });
        
        await newMessage.save();
        
        // Create message object to send to clients
        const messageToSend = {
          id: newMessage._id,
          senderId,
          groupId,
          content,
          timestamp,
          isGroupMessage: true,
          attachment,
          read: false,
          senderRole: socket.role // Include sender role in the message sent to clients
        };
        
        // Emit message to the group room
        io.to(groupId).emit('new_group_message', messageToSend);
        
        // Broadcast to all connected clients who should receive this group message
        // This ensures everyone gets the message even if they haven't explicitly joined the room
        io.emit('group_update', {
          groupId,
          lastMessage: {
            content,
            senderId,
            timestamp
          }
        });
        
        // For users who aren't in the active group room but should receive the message
        // Get all online users who aren't in this group room
        const onlineUserIds = Array.from(onlineUsers.keys());
        
        onlineUserIds.forEach(userId => {
          // Skip the sender
          if (userId === senderId) return;
          
          // If user is not in the group room, send them a notification
          if (!groupRooms.has(groupId) || !groupRooms.get(groupId).has(userId)) {
            const userSocketId = onlineUsers.get(userId);
            if (userSocketId) {
              io.to(userSocketId).emit('new_group_message', messageToSend);
            }
          }
        });
      } catch (error) {
        console.error('Error handling group message:', error);
        socket.emit('error', { message: 'Failed to send group message' });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        console.log("a user disconnected")
        // Remove user from active rooms
        for (const [roomId, participants] of activeRooms.entries()) {
          if (participants.has(socket.userId)) {
            participants.delete(socket.userId);
            if (participants.size === 0) {
              activeRooms.delete(roomId);
            }
          }
        }
        
        // Remove user from group rooms
        for (const [groupId, participants] of groupRooms.entries()) {
          if (participants.has(socket.userId)) {
            participants.delete(socket.userId);
            if (participants.size === 0) {
              groupRooms.delete(groupId);
            }
          }
        }
        
        // Broadcast user status change
        io.emit('status_change', { userId: socket.userId, status: 'offline' });
      }
    });
  });
}