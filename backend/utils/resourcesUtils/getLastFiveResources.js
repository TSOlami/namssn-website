import Resource from "../../models/resourceModel.js";

// Find the last five uploaded resources
const getLastFiveResources = async (level) => {
  try {
    const lastFiveResources = await Resource.find({level: level}).sort({ createdAt: -1 }).limit(5);
    console.log(lastFiveResources);
    return lastFiveResources;
  } catch (error) {
    console.error('Error retrieving the last five resources:', error);
    throw error;
  }
};

export default getLastFiveResources;
