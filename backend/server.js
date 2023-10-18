import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
dotenv.config();
import path from 'path';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errormiddleware.js';
import connectDb from './config/db.js';
import bodyParser from 'body-parser';
connectDb();

// Define the port number for the server, default to 5000 if not provided in the environment
const port = process.env.PORT || 5000;

// Import route handlers
import userRoutes from './routes/userRoutes.js'; // User-related routes
import adminRoutes from './routes/adminRoutes.js'; // Admin-related routes

// Create an Express application
const app = express();
// Define the API version from environment variables, default to 'v1'
const apiVersion = process.env.API_VERSION || 'v1';

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use(cors());
app.use(bodyParser.json())
app.use(fileUpload());
const uploadsDirectory = path.join('C:/Users/DH4NN/Documents/ALX/namssn-website', 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

// Define routes for users and admin based on the API version
app.use(`/api/${apiVersion}/users`, userRoutes); // User routes
app.use(`/api/${apiVersion}/admin`, adminRoutes); // Admin routes


// Define a route for the root URL '/'
app.get('/', (req, res) => res.send('Server is ready'));

// Error handling middleware
app.use(notFound); // Handle 404 Not Found errors
app.use(errorHandler); // Handle other errors

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server is started on port ${port}`));
