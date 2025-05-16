import express from 'express';
import 'dotenv/config';
import {createProxyMiddleware} from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlware/auth.js';
import {services} from './services/service-registry.js';
import rateLimit from 'express-rate-limit';
import {xss} from 'express-xss-sanitizer';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';

const handleProxyError = (serviceName) => {
    return (err, req, res) => {
      console.error(`Error proxying request to ${serviceName}:`, err);
      res.status(500).json({ error: `Error proxying request to ${serviceName}` });
    };
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000 // Increased to 200 requests per 15 minutes
});

const app = express();
// Create HTTP server from Express app
const server = http.createServer(app);

// With this configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));
app.use(express.json());
app.use(cookieParser());
app.use(xss());
app.use(helmet());
app.use(limiter);

// Auth Service Routes (Public)
app.use('/api/auth', createProxyMiddleware({
    target: services.auth.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth/health': '/health',
      '^/api/auth': '/api/auth',
    },
    onError: handleProxyError('Auth Service'),
    logLevel: 'debug',
    cookieDomainRewrite: 'localhost',
    secure: false,
    onProxyReq: (proxyReq, req) => {
      // Check if this is a multipart/form-data request (file upload)
      if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        // For multipart/form-data, don't modify the request - let it pass through as is
        console.log('Proxying multipart form data request');
      } 
      // Only process JSON bodies for non-multipart requests
      else if (req.body && !req.headers['content-type']?.includes('multipart/form-data')) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
}));

// Protected Routes - Updated pathRewrite for all services
app.use('/api/courses',verifyToken,createProxyMiddleware({
    target: services.course.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/courses/health': '/health',
      '^/api/courses': '/api/courses' // Maintain original path
    },
    onError: handleProxyError('Course Service'),
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }}
}));

// Chat Service WebSocket Proxy
app.use('/api/chat', verifyToken, createProxyMiddleware({
    target: services.chat.url,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying
    pathRewrite: {
      '^/api/chat': '/api/chat' // Maintain original path
    },
    // Improved error handling for connection resets
    onError: (err, req, res) => {
      if (err.code === 'ECONNRESET') {
        console.warn(`Chat service connection reset: ${err.message}`);
        // For API requests, send a more user-friendly response
        if (res && !res.headersSent) {
          res.status(503).json({ 
            error: 'Chat service temporarily unavailable',
            message: 'Please try again later'
          });
        }
        // For WebSocket connections, the error is handled in onProxyReqWs
      } else {
        console.error(`Error proxying request to Chat Service:`, err)
      }
    },
    logLevel: 'debug',
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
      // Forward authentication headers for WebSocket handshake
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }
      
      // Handle WebSocket errors to prevent gateway shutdown
      socket.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
          console.warn(`WebSocket connection reset: ${err.message}`);
        } else {
          console.error('WebSocket proxy error:', err);
        }
        // Don't let the error propagate up to crash the server
      });
    },
    // Rest of the configuration remains the same
    onProxyReq: (proxyReq, req) => {
      if (req.body && req.headers['content-type'] === 'application/json') {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
}));

app.use('/api/notifications',createProxyMiddleware({
    target: services.notification.url,
    changeOrigin: true,
    pathRewrite: {
      '^/api/notifications/health': '/health',
      '^/api/notifications': '/api/notifications' // Maintain original path
    },
    onError: handleProxyError('Notification Service'),
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }}
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'API Gateway is running',
      services: {
        auth: services.auth.url,
        course: services.course.url,
        chat: services.chat.url,
        notification: services.notification.url
      }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Gateway Error:', err);
    res.status(500).json({ error: 'Internal Gateway Error' });
});

const PORT = process.env.PORT || 8000;
// Use the HTTP server instead of the Express app to listen
server.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
    console.log('Service URLs:', services);
});


