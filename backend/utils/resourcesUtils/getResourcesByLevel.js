import Resource from '../../models/resourceModel.js';

const getResourcesByLevel = async (level) => {
    try {
        const resource = await Resource.find({level: level}).sort({ updatedAt: -1 });
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