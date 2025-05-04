import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Notification service is running' });
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('Client connected to notification service');
  
  socket.on('subscribe', (userId) => {
    console.log(`User ${userId} subscribed to notifications`);
    socket.join(userId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from notification service');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notification-service')
.then(() => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => {
    console.log(`Notification service running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});