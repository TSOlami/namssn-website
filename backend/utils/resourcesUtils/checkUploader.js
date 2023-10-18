import getResource from "./getResource.js"

const checkUploader = async (fileUrl, senderId) => {
    try {
        const resource = await getResource(fileUrl)
        if (resource.user._id.toString() === senderId) {
            console.log(`============${senderId}==============`)
            return resource._id.toString();
        }
        return none;
        } catch(err) {
        console.log("Error")
        }
}

export default checkUploader;