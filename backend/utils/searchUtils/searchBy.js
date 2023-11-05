import User from "../../models/userModel.js";
import Post from "../../models/postModel.js";
import Resource from "../../models/resourceModel.js";

// search for matching user
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

// search for matching post
const searchPosts = async (value) => {
  try {
      const posts = await Post.find({ text: { $regex: `.*${value}.*`, $options: 'i'} }).populate('user', '-password');
      return posts;
    } catch (error) {
      // handle error appropriately
      console.error(error);
      throw new Error('Failed to find posts.');
    }
}

// search for matching resource
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