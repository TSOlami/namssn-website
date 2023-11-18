import uploadResource from "./resourcesUtils/uploadResource.js";
import * as fs from 'fs';
import createFileList from "./resourcesUtils/createFileList.js";
import checkUploader from "./resourcesUtils/checkUploader.js";
import removeResource from "./resourcesUtils/removeResource.js";
import path from "path";
const fileDir = 'C:/Users/DH4NN/Documents/ALX/namssn-website';
import getResourcesByLevel from "./resourcesUtils/getResourcesByLevel.js";
import getLastSixResources from "./resourcesUtils/getLastSixResources.js";
import { bot } from "../server.js";

const getResources = async (req, res) => {
  try {
    const level1Resources = await getLastSixResources('100 Level');
    const level2Resources = await getLastSixResources('200 Level');
    const level3Resources = await getLastSixResources('300 Level');
    const level4Resources = await getLastSixResources('400 Level');
    const level5Resources = await getLastSixResources('500 Level');
    const resources = [level1Resources, level2Resources, level3Resources, level4Resources, level5Resources];
    const formattedResponse = {}
    for (let i=0; i<resources.length; i++) {
      //  creates a list list of dict with 'filename' as the key and 'details' as the value
      if (resources[i].length !== 0) {
        const formattedResources = await createFileList(resources[i])
        const level = ((i+ 1) * 100).toString() + ' Level';
        console.log(formattedResources)
        formattedResponse[level] = formattedResources
        
      }
    }
    return formattedResponse;
  } catch (err) {
    console.log("An error occurred while retrieving files", err);
    throw err; // Throw the error to be caught by the calling function
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
      const uniquefileName = Date.now() + '_' + Math.random().toString(36).substring(7);
      const fileUrl = uniquefileName + '_' + filename;
      
      if (!file.data || !file.data.buffer || file.data.buffer.length === 0) {
        return res.status(400).send('Invalid file data.');
      }
      const chatId = 1276219038;
      const fileArrayBuffer = file.data.buffer;
      const fileBuffer = Buffer.from(fileArrayBuffer);
      // const document = fs.createReadStream('../../backendRoadmap.pdf')
      await bot.sendDocument(chatId, fileBuffer, { caption: 'random file' })
          
      const response = await uploadResource(filename, description, userId, uploaderName, fileUrl, semester, course);
      if (response) {
        const formattedResponse = {[fileUrl]: {
        uploaderUsername: response[2], title: filename,
        description: description, date: date, 
        semester: semester, course: course
        }}
        return formattedResponse;
      }
    } catch (err) {
      console.log(err);
      return [];
  }
};

// gets the resources for a specified level
const getSpecifiedResources = async (level) => {
  try {
    const response = await getResourcesByLevel(level);
    if (response) {
      const filesList = createFileList(response);
      console.log(filesList)
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
  const fileUrl = req.params.filename;
  const senderId = req.body._id;
  // client.delete("files")
  const resourceId = await checkUploader(fileUrl, senderId);

  if (resourceId || (req.user && req.user.role === 'admin')) {
      await removeResource(resourceId, senderId)
      const filepath = path.join(fileDir + '/uploads', req.params.filename)

      fs.unlink(filepath, async (err) => { // Convert the callback to an async function
        // deletes the file from the server
        if (err) {
            console.log("Unable to delete:", err)
        }
        console.log("File has been deleted successfully");
    })
    return ("Access Approved");
  } else {
      console.log("Uploader not found")
      return ("Access Denied");
  }
}


export {postResource, getResources, getSpecifiedResources,deleteResource};