import * as fs from "fs";

export default async function checkUploadDirectory(directory) {
    try {
      await fs.promises.access(directory, fs.constants.F_OK);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Directory does not exist, create it
        await fs.promises.mkdir(directory);
        console.log(`Created directory: ${directory}`);
      } else {
        // Handle other errors
        console.error('Error:', error);
      }
    }
  };