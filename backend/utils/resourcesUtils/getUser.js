import User from '../../models/userModel.js';

const getUser = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (err) {
        console.log("An error occcurred. Unable to fetch user", err);
    }
};

export default getUser;