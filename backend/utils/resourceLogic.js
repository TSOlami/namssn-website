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
// import {client} from '../server.js'
import getLastFiveResources from "./resourcesUtils/getLastFiveResources.js";

const getResources = async (req, res) => {
  try {
    // const result = await client.get("files");
    // console.log("=========". result)
    // if (result.value !== null) {
    //   console.log("here")
    //   console.log(JSON.parse(result.value))
    //   return JSON.parse(result.value); // Return the value from the getResources function
    // } else {
      const level1Resources = await getLastFiveResources('100 Level');
      const level2Resources = await getLastFiveResources('200 Level');
      const level3Resources = await getLastFiveResources('300 Level');
      const level4Resources = await getLastFiveResources('400 Level');
      const level5Resources = await getLastFiveResources('500 Level');
      const resources = [level1Resources, level2Resources, level3Resources, level4Resources, level5Resources];
      const formattedResponse = {}
      for (let i=0; i<resources.length; i++) {
        if (resources[i].length !== 0) {
          const formattedResources = await createFileList(resources[i])
          const level = ((i+ 1) * 100).toString() + ' Level';
          console.log(formattedResources)
          formattedResponse[level] = formattedResources
          
        }
      }
      // client.set("files", JSON.stringify(formattedResponse));
      return formattedResponse;
    // }
    
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
        // await client.get("files").then((result) => {
        //     if (result.value) {
        //       let existingFilesDetiails = JSON.parse(result.value);
        //       if (Object.keys(existingFilesDetiails).includes(semester)) {
        //         existingFilesDetiails[semester].unshift(formattedResponse)
        //         if (Object.keys(existingFilesDetiails[semester]).length > 5) {
        //           existingFilesDetiails[semester].pop()
        //         }
        //       } else{
        //         existingFilesDetiails[semester] = [formattedResponse];
        //       }
        //       client.set("files", JSON.stringify(existingFilesDetiails))
        //     } else {
        //       client.set("files", JSON.stringify(fileDetails))
        //     }
        // })
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
  const level = req.body.level
  // client.delete("files")
  const resourceId = await checkUploader(fileUrl, senderId);

  if (resourceId || (req.user && req.user.role === 'admin')) {
      await removeResource(resourceId, senderId)
      const filepath = path.join(fileDir + '/uploads', req.params.filename)

      fs.unlink(filepath, async (err) => { // Convert the callback to an async function
          if (err) {
              console.log("Unable to delete:", err)
          }
          // try {
          //     const result = await client.get("files"); // Use await here
          //     if (result.value) {
          //         let existingFilesDetiails = JSON.parse(result.value);
          //         const filesUrlList = [...existingFilesDetiails[level].map(dict => Object.keys(dict))].flat()
          //         console.log(filesUrlList)
          //         console.log(fileUrl)
          //         console.log("urllists above")
          //         if (filesUrlList.includes(fileUrl)) {
          //             console.log('present')
          //             const fileIndex = filesUrlList.indexOf(fileUrl)
          //             existingFilesDetiails[level].splice(fileIndex, 1)
          //             const latestResource = await getLatestResource(level) // Use await here
          //             if (latestResource) {
          //               const formattedResponse = {[latestResource.fileUrl]: {
          //                 uploaderUsername: latestResource.uploaderName, title: latestResource.title,
          //                 description: latestResource.description, date: latestResource.updatedAt, 
          //                 semester: latestResource.level, course: latestResource.course
          //               }}
          //               existingFilesDetiails[level].unshift(formattedResponse)
          //             }
          //             client.set("files", JSON.stringify(existingFilesDetiails))
          //           }
          //     }
          // } catch (err) {
          //     console.log(err)
          // }
          console.log("File has been deleted successfully");
      })
      return ("Access Approved");
  } else {
      console.log("Uploader not found")
      return ("Access Denied");
  }
}


export {postResource, getResources, getSpecifiedResources,deleteResource};