import getResource from "./getResource.js"

// check the uploader of a resource
const checkUploader = async (fileUrl, senderId) => {
    try {
        console.log(fileUrl, senderId)
        const resource = await getResource(fileUrl)
        if (resource.user._id.toString() === senderId) {
            return resource._id.toString();
        }
        return none;
        } catch(err) {
        console.log("Error")
        }
}

export default checkUploader;