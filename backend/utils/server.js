import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from '../routes/userRoutes.js'; 
import adminRoutes from '../routes/adminRoutes.js';

import { notFound, errorHandler } from '../middleware/errormiddleware.js';

function createServer() {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }));

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: { message: 'Too many OTP requests, please try again after 5 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply general rate limiting to all requests
  app.use(generalLimiter);

  // Middleware setup
  app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
  app.use(cookieParser()); // Parse cookies
  
  // CORS configuration
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || true 
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  app.use(cors(corsOptions));
  
  app.use(bodyParser.json());
  app.use(fileUpload());
  
  const apiVersion = process.env.API_VERSION || 'v1';

  app.use(`/api/${apiVersion}/users/auth`, authLimiter);
  app.use(`/api/${apiVersion}/users/generate-otp`, otpLimiter);
  app.use(`/api/${apiVersion}/users/resend-otp`, otpLimiter);
  app.use(`/api/${apiVersion}/users/verify-otp`, authLimiter);

  app.use(`/api/${apiVersion}/users`, userRoutes);
  app.use(`/api/${apiVersion}/admin`, adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));
  app.get('/', (req, res) => res.send('Server is ready'));

  return app;
}

export default createServer;
