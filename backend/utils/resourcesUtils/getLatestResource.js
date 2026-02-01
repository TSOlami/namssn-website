import Resource from "../../models/resourceModel.js";

const getLatestResource = async (level) => {
    try {
        const fifthLatestResource = await Resource.find({ level }).sort({ createdAt: -1 }).skip(5).limit(1).select('-botToken');
        return fifthLatestResource[0];
        } catch (error) {
        console.error('Error retrieving the sixth latest resource:', error);
        throw error;
    }
}
export default getLatestResource;
