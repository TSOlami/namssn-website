import express from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();

import connectDb from './config/db.js';
connectDb();
import path from 'path'
import createServer from './utils/server.js';

const app = createServer();
const bot_token = '6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I';
const bot = new TelegramBot(bot_token, { polling: true });
bot.on('document', (msg) => {
  const chatId = msg?.chat?.id;
  const description = msg?.caption
  const user = `${msg?.from?.username} (Telegram)`
  const fileurl = msg.document.thumb.file_id

  console.log("document")
  console.log(chatId, description, user, fileurl);
});
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  console.log("photo")
  console.log(msg);
});

// Define the port number for the server, default to 5000 if not provided in the environment
const port = process.env.PORT || 5000;

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
