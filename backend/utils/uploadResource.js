import Resource from '../models/resourceModel.js';

// uploads a resource to the databaas
const uploadResource = async (filename, description, userId, fileUrl, level, course) => {
    try {
        const newResource = new Resource({
            title: filename,
            description: description,
            user: userId, 
            fileUrl: fileUrl,
            level: level,
            course: course
        });
        const savedResource =  newResource.save();
        console.log('Resource saved successfully:', savedResource);
    } catch (err) {
        console.log(err);
    }
}
export default uploadResource;