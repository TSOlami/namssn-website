import uploadResource from "./resourcesUtils/uploadResource.js";
import * as fs from 'fs';
import createFileList from "./resourcesUtils/createFileList.js";
import checkUploader from "./resourcesUtils/checkUploader.js";
import removeResource from "./resourcesUtils/removeResource.js";
import getResourcesByLevel from "./resourcesUtils/getResourcesByLevel.js";
import getLastSixResources from "./resourcesUtils/getLastSixResources.js";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

let bot_token = process.env.BOT_TOKEN;
if (process.env.NODE_ENV === 'production') {
  bot_token = process.env.PRODUCTION_BOT_TOKEN
}
const getResources = async (req, res) => {
  try {
    const level1Resources = await getLastSixResources('100 Level');
    const level2Resources = await getLastSixResources('200 Level');
    const level3Resources = await getLastSixResources('300 Level');
    const level4Resources = await getLastSixResources('400 Level');
    const level5Resources = await getLastSixResources('500 Level');
    const telegram = await getLastSixResources('N/A');
    const resources = [level1Resources, level2Resources, level3Resources, level4Resources, level5Resources, telegram];
    const formattedResponse = {}
    for (let i=0; i<resources.length; i++) {
      if (resources[i].length !== 0) {
        const formattedResources = await createFileList(resources[i])
        let level = '';
        if (i+1 === 6) {
          level = 'N/A'
        } else {
          level = ((i+ 1) * 100).toString() + ' Level';
        }
        formattedResponse[level] = formattedResources
        
      }
    }
    return formattedResponse;
  } catch (err) {
    console.log("An error occurred while retrieving files", err);
    throw err;
  }
}

const postResource = async (req, res) => {
  const { file } = req.files;
  const { userId, date, description, semester, uploaderName, course } = req.body;
  if (!file) {
      return res.status(400).send('No file uploaded.');
  }

  const filename = file.name;

  try {
    if (!file.data || !file.data.buffer || file.data.buffer.length === 0) {
      return res.status(400).send('Invalid file data.');
    }
    const chatId = process.env.CHAT_ID;
    const fileArrayBuffer = file.data.buffer;;
    const form = new FormData();
    const fileBlob = new Blob([Buffer.from(fileArrayBuffer)], { type: 'application/octet-stream' });
    form.append('chat_id', chatId);
    form.append('caption', description );
    form.append('document', fileBlob, filename);

    // Make the API request using axios
    const res = await axios.post(`https://api.telegram.org/bot${bot_token}/sendDocument`, form, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
    });
    if (res) {
      let isLarge = false;
      let fileUrl = res?.data?.result?.document?.file_id
      if (file.size > 19900000) {
        isLarge = true;
        const chatId2 = chatId.slice(4, chatId.length)
        const message_id = res?.data?.result?.message_id;
        fileUrl = `https://t.me/c/${chatId2}/${message_id}`
      }
      const response = await uploadResource(filename, description, userId, uploaderName, fileUrl, semester, isLarge=isLarge, course, bot_token);
      if (response) {
        const formattedResponse = {[fileUrl]: {
        uploaderUsername: response[2], title: filename,
        description: description, date: date,
        semester: semester, course: course,
        isLarge: isLarge,
        }}
        return formattedResponse;
      }
    }
    } catch (err) {
      console.log(err);
      return [];
  }
};

const getSpecifiedResources = async (level) => {
  try {
    if (level === 'telegram') {
      level = 'N/A'
    } 
    const response = await getResourcesByLevel(level);
    if (response) {
      const filesList = createFileList(response);
      return filesList
    } else {
      console.log('No response');
      throw new Error('No response from getResourcesByLevel');
    }
  } catch (err) {
    console.error('An error occurred:', err);
    throw new Error('An error occurred during processing');
  }
};

const deleteResource = async (req, res) => {
  const fileUrl = req.params.filename.split('+')[0];
  const senderId = req.body._id;
  const resourceId = await checkUploader(fileUrl, senderId);
  if (resourceId || (req.user && req.user.role === 'admin')) {
    await removeResource(resourceId, senderId)
    return ("Access Approved");
  } else {
      console.log("Uploader not found")
      return ("Access Denied");
  }
}


export {postResource, getResources, getSpecifiedResources,deleteResource};