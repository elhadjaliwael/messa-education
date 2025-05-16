import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import coursesRoutes from './routes/coursesRoutes.js';
import analyticsRoutes from './routes/analytics.routes.js';
dotenv.config();

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/courses')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/courses', coursesRoutes);
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