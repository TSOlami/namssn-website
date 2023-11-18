import uploadResource from "../resourcesUtils/uploadResource.js";

const photoUploader = (msg) => {
    const chatId = msg?.chat?.id;
    const fileName = "Untitled Image"; 
    const user_id = '6557d19b0668a1d32cb9b2ea';
    const description = msg?.caption;
    const user = `${msg?.from?.username} (Telegram)`;
    const fileurl = msg?.photo[0].file_id;
    const level = 'N/A';
    uploadResource(fileName, description, user_id, user, fileurl, level, "none")
    // // console.log("document")
    console.log(chatId, description, user, fileurl);
}

export default photoUploader;