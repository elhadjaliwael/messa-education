import express from 'express';
import 'dotenv/config';
import {createProxyMiddleware} from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import registry from './registry.json' with {type: 'json'};
import authenticateToken from './middlware/auth.js';
import authRoutes from './routes/authRoutes.js';
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use('/auth',authRoutes);
for (const service in registry.services) {
    app.use(`/${service}`, createProxyMiddleware({
        target: registry.services[service].url,
        changeOrigin: true,
        pathFilter : registry.services[service].routes
    }));
}

app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
});


