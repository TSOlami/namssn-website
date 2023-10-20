import Resource from '../../models/resourceModel.js';
import User from '../../models/userModel.js';

// uploads a resource to the database
const uploadResource = async (filename, description, userId, fileUrl, level, course) => {
    console.log("===========",userId, filename, description, fileUrl, level, course)
    try {
        const newResource = new Resource({
            title: filename,
            description: description,
            user: userId,
            fileUrl: fileUrl,
            level: level,
            course: course
        });
        const savedResource = await newResource.save();
        // if (savedResource) {        
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId.toString() }, // Find the user by their unique identifier
                { $push: { resources: savedResource._id } }, // The updated information for the user
                { new: true }
            );
            const date = savedResource.updatedAt;
            const options = { day: 'numeric', month: 'short', year: '2-digit' };
            const formatter = new Intl.DateTimeFormat('en', options);
            const formattedDate = formatter.format(date);
            // console.log('Resource saved successfully:', savedResource);
            return [savedResource, formattedDate, updatedUser.name];
        // }
    } catch (err) {
        console.log(err);
    }
};

export default uploadResource;
