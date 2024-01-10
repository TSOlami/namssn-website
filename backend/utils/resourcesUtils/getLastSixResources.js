import Resource from "../../models/resourceModel.js";

// Find the last five uploaded resources
const getLastSixResources = async (level) => {
  try {
    const lastFiveResources = await Resource.find({level: level}).sort({ createdAt: -1 }).limit(6);
    return lastFiveResources;
  } catch (error) {
    console.error('Error retrieving the last five resources:', error);
    throw error;
  }
};

export default getLastSixResources;
