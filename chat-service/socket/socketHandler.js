import Message from '../models/messages.js';

// Map to store online users: username -> socket.id
const onlineUsers = new Map();

export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Handle user login
    socket.on('userLogin', async ({ username, socketId }) => {
      // Store user connection
      onlineUsers.set(username, socket.id);
      socket.username = username;
      
      console.log(`User ${username} logged in with socket ID ${socket.id}`);
      console.log('Current online users:', Array.from(onlineUsers.entries()));
      
      // Broadcast updated online users list to all clients
      broadcastOnlineUsers(io);
    });
    
    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      try {
        const { senderId, senderUsername, recipientId, text, image } = messageData;
        
        console.log(`Message from ${senderId} to ${recipientId}: ${text}`);
        
        // Save message to database
        const newMessage = new Message({
          senderId,
          senderUsername,
          receiverId: recipientId,
          text,
          image,
          timestamp: new Date()
        });
        
        await newMessage.save();
        
        // Send message to recipient if online
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId) {
          console.log(`Sending message to recipient socket: ${recipientSocketId}`);
          io.to(recipientSocketId).emit('receiveMessage', {
            id: newMessage._id,
            senderId,
            senderUsername,
            recipientId,
            text,
            image,
            timestamp: newMessage.timestamp
          });
        } else {
          console.log(`Recipient ${recipientId} is not online`);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
    
    // Handle explicit request for online users
    socket.on('requestOnlineUsers', () => {
      socket.emit('getOnlineUsers', getOnlineUsersArray());
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.username) {
        console.log(`User ${socket.username} disconnected`);
        onlineUsers.delete(socket.username);
        broadcastOnlineUsers(io);
      }
    });
  });
  
  // Function to broadcast online users
  function broadcastOnlineUsers(io) {
    const users = getOnlineUsersArray();
    console.log('Broadcasting online users:', users);
    io.emit('getOnlineUsers', users);
  }
  
  // Function to get online users as an array
  function getOnlineUsersArray() {
    return Array.from(onlineUsers.entries()).map(([username, socketId]) => ({
      id: username,
      username,
      socketId
    }));
  }
}