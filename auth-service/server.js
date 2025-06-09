import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import cookieParser from 'cookie-parser';
import { setupRabbitMQ, closeRabbitMQ } from './services/rabbitmq.service.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cookieParser())
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/forgot-password', passwordResetRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Auth service is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/auth-service')
.then(async () => {
  console.log('Connected to MongoDB');
  
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
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
// Graceful shutdown
process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});