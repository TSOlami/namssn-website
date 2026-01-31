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
  // Create an Express application
  const app = express();

  // Security middleware - Helmet helps secure Express apps by setting various HTTP headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiting - Protect against brute force attacks
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Stricter rate limiting for authentication routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per windowMs
    message: { message: 'Too many authentication attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // OTP rate limiting - Prevent OTP abuse
  const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
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

  // Apply stricter rate limiting to auth and OTP routes
  app.use(`/api/${apiVersion}/users/auth`, authLimiter);
  app.use(`/api/${apiVersion}/users/generate-otp`, otpLimiter);
  app.use(`/api/${apiVersion}/users/resend-otp`, otpLimiter);
  app.use(`/api/${apiVersion}/users/verify-otp`, authLimiter);

  app.use(`/api/${apiVersion}/users`, userRoutes);
  app.use(`/api/${apiVersion}/admin`, adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  // Health check endpoint
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

  // Define a route for the root URL '/'
  app.get('/', (req, res) => res.send('Server is ready'));

  return app;
}

export default createServer;
