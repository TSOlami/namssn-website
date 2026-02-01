import Resource from '../../models/resourceModel.js';
import User from '../../models/userModel.js';

const removeResource = async (resourceId, userId) => {
    try {
        const deletedResource = await Resource.deleteOne({_id: resourceId});
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { resources: deletedResource._id } },
            { new: true }
        );
        
        console.log('Resource deleted successfully:', deletedResource);
    } catch (err) {
        console.log(err);
    }
};

export default removeResource;
