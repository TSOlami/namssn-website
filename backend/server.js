import express from 'express';
import dotenv from 'dotenv';
import memjs from 'memjs';
import connectDb from './config/db.js';

import createServer from './utils/server.js';

dotenv.config();
connectDb();

// Define the port number for the server, default to 5000 if not provided in the environment
const port = process.env.PORT || 5000;

// Create a memjs client
export const client = memjs.Client.create();

const app = createServer();

app.listen(port, async () => {
  try {
    await connectDb(); // Wait for the database connection to be established
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the application if the database connection fails
  }

  console.log(`Server is started on port ${port}`);
});
