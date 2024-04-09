import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import userRoutes from '../routes/userRoutes.js'; 
import adminRoutes from '../routes/adminRoutes.js';

import { notFound, errorHandler } from '../middleware/errormiddleware.js';

function createServer() {
  // Create an Express application
  const app = express();

  // Middleware setup
  app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
  app.use(cookieParser()); // Parse cookies
  app.use(cors());
  app.use(bodyParser.json());
  app.use(fileUpload());
  
	const apiVersion = process.env.API_VERSION || 'v1';

	app.use(`/api/${apiVersion}/users`, userRoutes);
	app.use(`/api/${apiVersion}/admin`, adminRoutes);

	app.use(notFound);
	app.use(errorHandler);

  // Define routes here, you can add your route handling logic

  // Define a route for the root URL '/'
  app.get('/', (req, res) => res.send('Server is ready'));

  return app;
};

export default createServer;
