import checkUploadDirectory from "./resourcesUtils/checkUploadDirectory.js";
import uploadResource from "./resourcesUtils/uploadResource.js";
import * as fs from 'fs';
import getAllResources from "./resourcesUtils/getAllResources.js";
import createFileList from "./resourcesUtils/createFileList.js";
import checkUploader from "./resourcesUtils/checkUploader.js";
import removeResource from "./resourcesUtils/removeResource.js";
import path from "path";
import getUser from "./resourcesUtils/getUser.js";

const fileDir = 'C:/Users/DH4NN/Documents/ALX/namssn-website';

const getResources = async (req, res) => {
    try {
        const response = await getAllResources();
        const fileList = await createFileList(response);
      
        if (fileList.length > 0) {
          // console.log(fileList);
          return({ files: fileList });
        } else {
          return [];
        }
      } catch (err) {
        console.log(err);
        return [];
      }
}

const postResource = async (req, res) => {
  const { file } = req.files;
  const { userId, date, description, semester, course } = req.body;
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
      const response = await uploadResource(filename, description, userId, fileUrl, semester, course);
      if (response) {
        const formattedResponse = {[fileUrl]: {
        uploaderUsername: response[2], title: filename,
        description: description, date: date, 
        semester: semester, course: course
        }}
        console.log(formattedResponse)
        return formattedResponse;
      }
    } catch (err) {
      console.log(err);
      return [];
  }
};


const deleteResource = async (req, res) => {
    const fileUrl = req.params.filename;
    const senderId = req.body._id;
    const resourceId = await checkUploader(fileUrl, senderId);

    if (resourceId || (req.user && req.user.role === 'admin')) {
        await removeResource(resourceId, senderId)
        const filepath = path.join(fileDir + '/uploads', req.params.filename)

        fs.unlink(filepath, (err) => {
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

export {postResource, getResources, deleteResource};