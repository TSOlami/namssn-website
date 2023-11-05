import Resource from '../../models/resourceModel.js';

//  resturns a resource with the specified fileUrl
const getResource = async (fileUrl) => {
    try {
        const resource = await Resource.findOne({fileUrl: fileUrl}).populate('user', '-password');
        if (resource) {
            console.log("Resource found")
        } else {
            console.log("Resource not found")
        }
        return resource;
    } catch (err) {
        console.log("An error occcurred. Unable to fetch resource", err);
    }
};

export default getResource;