import User from '../models/userModel.js';

const getUser = async (id) => {
    try {
        const user = await User.find({id: id});
        console.log(user)
        return user;
    } catch (err) {
        console.log("An error occcurred. Unable to fetch user", err);
    }
};

export default getUser;