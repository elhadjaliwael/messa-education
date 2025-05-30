import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import notificationRoutes from './routes/notification.routes.js';
import { socketHandler } from './socket/socketHandler.js';
import { setupRabbitMQ, closeRabbitMQ } from './services/rabbitmq.service.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
  },
  path : '/api/notifications/notification-socket',
  transports : ['websocket'],
  pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3
});

const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Make io available to routes
socketHandler(io);
global.io = io;

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Notification service is running' });
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
try {
  await setupRabbitMQ();
  console.log('Connected to RabbitMQ');
} catch (error) {
  console.error('RabbitMQ connection error:', error);
}