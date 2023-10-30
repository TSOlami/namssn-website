import User from "../../models/userModel.js";
import Post from "../../models/postModel.js";
import Resource from "../../models/resourceModel.js";

const searchUsers = async (username) => {
    try {
        const users = await User.find({ username: { $regex: `.*${username}.*`, $options: 'i'} });
        return users;
      } catch (error) {
        // handle error appropriately
        console.error(error);
        throw new Error('Failed to find users by username.');
      }
}

const searchPosts = async (value) => {
  try {
      const posts = await Post.find({ text: { $regex: `.*${value}.*`, $options: 'i'} }).populate('user');
      return posts;
    } catch (error) {
      // handle error appropriately
      console.error(error);
      throw new Error('Failed to find posts.');
    }
}

const searchResources = async (value) => {
  try {
      const resources = await Resource.find({ title: { $regex: `.*${value}.*`, $options: 'i'} });
      return resources;
    } catch (error) {
      // handle error appropriately
      console.error(error);
      throw new Error('Failed to find resources.');
    }
}

export {searchUsers, searchPosts, searchResources};