import Resource from '../../models/resourceModel.js';
import User from '../../models/userModel.js';

const uploadResource = async (filename, description, userId, uploaderName, fileUrl, level, isLarge, course, bot_token) => {
    try {
        const newResource = new Resource({
            title: filename,
            description: description,
            user: userId,
            uploaderName: uploaderName,
            fileUrl: fileUrl,
            level: level,
            isLarge: isLarge,
            course: course,
            botToken: bot_token
        });
        const savedResource = await newResource.save();        
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId.toString() },
            { $push: { resources: savedResource._id } },
            { new: true }
        );
        const date = savedResource.updatedAt;
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        const formatter = new Intl.DateTimeFormat('en', options);
        const formattedDate = formatter.format(date);
        console.log("successfully uploaded")
        return [savedResource, formattedDate, updatedUser.name];
    } catch (err) {
        console.log(err);
    }
};

export default uploadResource;
