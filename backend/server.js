import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import memjs from 'memjs';
import connectDb from './config/db.js';
connectDb();
import path from 'path'
import createServer from './utils/server.js';

const app = createServer();

// Define the port number for the server, default to 5000 if not provided in the environment
const port = process.env.PORT || 5000;

// Create a memjs client
export const client = memjs.Client.create();

// ---------------- deployment-----------------------
const __dirname1=path.resolve();
if (process.env.NODE_ENV ==='production') {
  app.use(express.static(path.join(__dirname1, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1,'frontend','dist','index.html'));
  });
  
} else {
  app.get("/",(req,res)=>{
    res.send('API is running');
  });
}
//-------------deployment--------------

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
