import express from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import documentUploader from './utils/botUtils/documentUploader.js';
import photoUploader from './utils/botUtils/photoUploader.js';
dotenv.config();

import connectDb from './config/db.js';
connectDb();
import path from 'path'
import createServer from './utils/server.js';

const app = createServer();
let bot_token = process.env.BOT_TOKEN;
if (process.env.NODE_ENV === 'production') {
  bot_token = process.env.PRODUCTION_BOT_TOKEN
}
const chat_id = process.env.CHAT_ID || 1276219038;
export const bot = new TelegramBot(bot_token, { polling: true });
bot.on('message', (msg) => {
  console.log(msg)
  if (msg.chat.id !== chat_id && msg.chat.type === 'private') {
    bot.sendMessage(msg.chat.id, "Hello, I'm NAMSSN FUTMINNA Bot. I can't fulfill your request at the moment. If you have any questions or need assistance, visit the NAMSSN official website. Thank you!")
  }
})
// bot.on('document', (msg) => {
//   if (msg.chat.id === chat_id) {
//     documentUploader(msg);
//     bot.sendMessage(chat_id, "This file has been uploaded to our website", {reply_to_message_id: msg.message_id})
//   }
// });
// bot.on('photo', (msg) => {
//   if (msg.chat.id === chat_id) {
//     photoUploader(msg);
//     bot.sendMessage(chat_id, "This file has been uploaded to our website", {reply_to_message_id: msg.message_id})
//   }
// });

// Define the port number for the server, default to 8080 if not provided in the environment
const port = process.env.PORT || 8080;

// ---------------- deployment-----------------------
const __dirname1=path.resolve();
if (process.env.NODE_ENV === 'production') {
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
