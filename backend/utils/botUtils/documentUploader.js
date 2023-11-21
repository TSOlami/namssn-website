import uploadResource from "../resourcesUtils/uploadResource.js";
import dotenv from 'dotenv';
dotenv.config();

const bot_id = process.env.BOT_ID;
const documentUploader = (msg) => {
    console.log(msg)
    const chatId = msg?.chat?.id;
    const fileName = msg?.document?.file_name; 
    const user_id = bot_id;
    const description = msg?.caption;
    const user = `${msg?.from?.username} (Tel)`;
    const fileurl = msg?.document?.file_id;
    const level = 'N/A';
    uploadResource(fileName, description, user_id, user, fileurl, level, "none")
}

export default documentUploader;