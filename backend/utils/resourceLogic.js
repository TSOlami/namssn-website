import checkUploadDirectory from "./resourcesUtils/checkUploadDirectory.js";
import uploadResource from "./resourcesUtils/uploadResource.js";
import * as fs from 'fs';
import getAllResources from "./resourcesUtils/getAllResources.js";
import createFileList from "./resourcesUtils/createFileList.js";
import checkUploader from "./resourcesUtils/checkUploader.js";
import removeResource from "./resourcesUtils/removeResource.js";
import path from "path";
import getUser from "./resourcesUtils/getUser.js";
import getLatestResource from "./resourcesUtils/getLatestResource.js";
const fileDir = 'C:/Users/DH4NN/Documents/ALX/namssn-website';
import getResourcesByLevel from "./resourcesUtils/getResourcesByLevel.js";
import {client} from '../server.js'

const getResources = async (req, res) => {
  try {
    const result = await client.get("files");
    return JSON.parse(result.value); // Return the value from the getResources function
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
  const uploadDirectory = 'uploads';

  try {
      await checkUploadDirectory(uploadDirectory);
      const uniquefileName = Date.now() + '_' + Math.random().toString(36).substring(7);
      const fileUrl = uniquefileName + '_' + filename;

      await fs.promises.writeFile(`${uploadDirectory}/${fileUrl}`, file.data);
      // const uploaderUsername = await getUser(userId).name;
      const response = await uploadResource(filename, description, userId, uploaderName, fileUrl, semester, course);
      if (response) {
        const formattedResponse = {[fileUrl]: {
        uploaderUsername: response[2], title: filename,
        description: description, date: date, 
        semester: semester, course: course
        }}
        // await client.delete("files")
        const fileDetails = {[semester]: [formattedResponse]}
        await client.get("files").then((result) => {
            if (result.value) {
              let existingFilesDetiails = JSON.parse(result.value);
              if (Object.keys(existingFilesDetiails).includes(semester)) {
                existingFilesDetiails[semester].unshift(formattedResponse)
                if (Object.keys(existingFilesDetiails[semester]).length > 5) {
                  existingFilesDetiails[semester].pop()
                }
              } else{
                existingFilesDetiails[semester] = [formattedResponse];
              }
              client.set("files", JSON.stringify(existingFilesDetiails))
            } else {
              client.set("files", JSON.stringify(fileDetails))
            }
        })
        return formattedResponse;
      }
    } catch (err) {
      console.log(err);
      return [];
  }
};

const getSpecifiedResources = async (level) => {
  try {
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
  const fileUrl = req.params.filename;
  const senderId = req.body._id;
  const resourceId = await checkUploader(fileUrl, senderId);

  if (resourceId || (req.user && req.user.role === 'admin')) {
      await removeResource(resourceId, senderId)
      const filepath = path.join(fileDir + '/uploads', req.params.filename)

      fs.unlink(filepath, async (err) => { // Convert the callback to an async function
          if (err) {
              console.log("Unable to delete:", err)
          }
          try {
              const result = await client.get("files"); // Use await here
              if (result.value) {
                  let existingFilesDetiails = JSON.parse(result.value);
                  for (const level in existingFilesDetiails) {
                      const filesUrlList = [...existingFilesDetiails[level].map(dict => Object.keys(dict))].flat()
                      console.log(filesUrlList)
                      if (filesUrlList.includes(fileUrl)) {
                          console.log('present')
                          existingFilesDetiails[level].splice(existingFilesDetiails[level].findIndex(dict => dict.hasOwnProperty(fileUrl)), 1)
                          const latestResource = await getLatestResource() // Use await here
                          const formattedResponse = {[fileUrl]: {
                            uploaderUsername: latestResource.uploaderName, title: latestResource.title,
                            description: latestResource.description, date: latestResource.updatedAt, 
                            semester: latestResource.level, course: latestResource.course
                          }}
                          existingFilesDetiails[level].unshift(formattedResponse)
                          client.set("files", JSON.stringify(existingFilesDetiails))
                          console.log("-------------", formattedResponse)
                          console.log(existingFilesDetiails[level])
                          break;
                      }
                  }
              }
          } catch (err) {
              console.log(err)
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