import Resource from '../../models/resourceModel.js';
import User from '../../models/userModel.js';

// uploads a resource to the database
const removeResource = async (resourceId, userId) => {
    try {
        const deletedResource = await Resource.deleteOne({_id: resourceId});
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, // Find the user by their unique identifier
            { $pull: { resources: deletedResource._id } }, // The updated information for the user
            { new: true }
        );
        
        console.log('Resource deleted successfully:', deletedResource);
    } catch (err) {
        console.log(err);
    }
};

export default removeResource;
