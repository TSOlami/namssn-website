import Resource from '../../models/resourceModel.js';

// returns all resources
const getAllResources = async () => {
    try {
        const allResources = await Resource.find();
        return allResources;
    } catch (err) {
        console.log("An error occcurred. Unable to fetch resources", err);
    }
};

export default getAllResources;