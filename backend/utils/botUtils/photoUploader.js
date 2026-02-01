import uploadResource from "../resourcesUtils/uploadResource.js";
import dotenv from 'dotenv';
dotenv.config();

const bot_id = process.env.BOT_ID;
const photoUploader = (msg) => {
    const chatId = msg?.chat?.id;
    const photos = msg?.photo;
    const photo = photos[photos.length - 1]  
    const fileName = "Image.jpg"; 
    const user_id = bot_id;
    const description = msg?.caption;
    const user = `${msg?.from?.username} (Tel)`;
    const fileurl = photo.file_id;
    const level = 'N/A';
    uploadResource(fileName, description, user_id, user, fileurl, level, "none")
}

export default photoUploader;