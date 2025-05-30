import express from 'express';
import 'dotenv/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import { verifyToken } from './middlware/auth.js';
import { services } from './services/service-registry.js';
import rateLimit from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';

const upgradeGateway = (req, socket, head) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  console.log('Upgrade path:', pathname);

  let target = null;

  if (pathname.startsWith('/api/chat/chat-socket')) {
    target = 'http://localhost:3003';
  } else if (pathname.startsWith('/api/notifications/notification-socket')) {
    target = 'http://localhost:3004';
  }

  if (target) {
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
      logger: console,
    });

    proxy.upgrade(req, socket, head);
  } else {
    console.warn('No WS target found, destroying socket');
    socket.destroy();
  }
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000
});

const app = express();
const server = http.createServer(app);
server.on('upgrade', upgradeGateway);
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(cookieParser());
app.use(xss());
app.use(helmet());
app.use(limiter);

const createWsProxy = (targetUrl) => createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  ws: true,
  logger: console,
  on: {
    proxyReqWs: (proxyReq, req, socket) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }
      socket.on('error', (err) => {
        console.error('WebSocket proxy error:', err);
      });
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err);
      if (res && typeof res.writeHead === 'function') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal proxy error' }));
      }
    }
  }
});

app.use('/api/auth', createProxyMiddleware({
  target: `${services.auth.url}/api/auth`,
  changeOrigin: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('Proxying multipart form data request');
      } else if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req, res) => {
      console.error('Auth Service Proxy Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Auth service proxy error' });
      }
    }
  }
}));

app.use('/api/courses', verifyToken, createProxyMiddleware({
  target: `${services.course.url}/api/courses`,
  changeOrigin: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    error: (err, req, res) => {
      console.error('Course Service Proxy Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Course service proxy error' });
      }
    }
  }
}));

app.use('/api/chat', verifyToken, createProxyMiddleware({
  target: `${services.chat.url}/api/chat`,
  changeOrigin: true,
  ws: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req) => {
      if (!req.upgrade && req.body && req.headers['content-type'] === 'application/json') {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    proxyReqWs: (proxyReq, req, socket) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }
      socket.on('error', (err) => {
        console.error('WebSocket proxy error (chat):', err);
      });
    },
    error: (err, req, res) => {
      if (res && typeof res.writeHead === 'function' && !res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Chat service temporarily unavailable',
          message: 'Please try again later'
        }));
      } else {
        console.warn('WebSocket connection error — likely not an HTTP response. Skipping response.');
      }
    }
  }
}));

app.use('/api/notifications', verifyToken, createProxyMiddleware({
  target: `${services.notification.url}/api/notifications`,
  changeOrigin: true,
  ws: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req) => {
      if (!req.upgrade && req.body && req.headers['content-type'] === 'application/json') {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    proxyReqWs: (proxyReq, req, socket) => {
      if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization);
      }
      socket.on('error', (err) => {
        console.error('WebSocket proxy error (notifications):', err);
      });
    },
    error: (err, req, res) => {
      if (res && typeof res.writeHead === 'function' && !res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Notifications service temporarily unavailable',
          message: 'Please try again later'
        }));
      } else {
        console.warn('WebSocket connection error — likely not an HTTP response. Skipping response.' + err);
      }
    }
  }
}));



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

app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ error: 'Internal Gateway Error' });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Service URLs:', services);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
