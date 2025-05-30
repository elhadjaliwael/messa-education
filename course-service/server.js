import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import coursesRoutes from './routes/coursesRoutes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { setupRabbitMQ, closeRabbitMQ } from './services/rabbitmq.service.js';
import { extractInfo } from './middleware/extractInfo.js';
dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/courses')
    .then(() => {
        console.log('Connected to MongoDB')})
    .catch(err => console.error('MongoDB connection error:', err));

process.on('SIGINT', async () => {
    await closeRabbitMQ();
    process.exit(0);
});
try {
    await setupRabbitMQ();
    console.log('Connected to RabbitMQ');
} catch (error) {
    console.error('RabbitMQ connection error:', error);
}
// Routes
app.use('/api/courses',extractInfo ,coursesRoutes);
app.use('/api/courses/analytics',analyticsRoutes);
// Health check route
app.get('/', (req, res) => {
    res.send('Course service is running');
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Course service running on port ${PORT}`);
});