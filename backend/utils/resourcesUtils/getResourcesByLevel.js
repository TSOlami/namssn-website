import Resource from '../../models/resourceModel.js';

const getResourcesByLevel = async (level) => {
    try {
        const resource = await Resource.find({ level }).sort({ updatedAt: -1 }).select('-botToken');
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

export default getResourcesByLevel;