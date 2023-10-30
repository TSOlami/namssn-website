import Resource from "../../models/resourceModel.js";

// Find the latest resource
const getLatestResource = async () => {
    try {
        const fifthLatestResource = await Resource.find().sort({ createdAt: -1 }).skip(4).limit(1);
        console.log("+++++++++++", fifthLatestResource[0]);
        return fifthLatestResource[0];
        } catch (error) {
        console.error('Error retrieving the sixth latest resource:', error);
        throw error;
    }
}
export default getLatestResource;
