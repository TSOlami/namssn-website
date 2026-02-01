import Resource from "../../models/resourceModel.js";

const getLastSixResources = async (level) => {
  try {
    const lastFiveResources = await Resource.find({ level }).sort({ createdAt: -1 }).limit(6).select('-botToken');
    return lastFiveResources;
  } catch (error) {
    console.error('Error retrieving the last five resources:', error);
    throw error;
  }
};

export default getLastSixResources;
