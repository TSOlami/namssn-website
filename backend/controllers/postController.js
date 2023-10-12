import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';

// @desc Create a new post
// Route POST /api/v1/users/posts
// Access Private
const createPost = asyncHandler(async (req, res) => {
	const { text, image } = req.body;
  
	// You can access the currently logged-in user's information from req.user
	const userId = req.user._id;
  
	// Create a new post
	const newPost = new Post({
	  text,
	  image,
	  user: userId, // Associate the post with the user who created it
	});
  
	// Save the new post to the database
	const createdPost = await newPost.save();
  
	// Update the user's `posts` array
	const user = await User.findById(userId);
  
	// Add the post's _id to the user's posts array field
	user.posts.push(createdPost._id);
  
	// Save the updated user document to the database
	await user.save();
  
	res.status(201).json(createdPost);
  });
  
// @desc Get all posts and sort by timestamp
// Route GET /api/v1/user/posts
// Access Public
const getAllPosts = asyncHandler(async (req, res) => {
	// Fetch all posts from the database and sort by timestamp in descending order
	const allPosts = await Post.find()
	  .populate('user') // 'user' is the field referencing the user who posted the post
	  .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest posts first)
  
	res.status(200).json(allPosts);
  });
  
// @desc Get user's posts (My Posts)
// Route GET /api/v1/users/posts
// Access Private
const getUserPosts = asyncHandler(async (req, res) => {
	const userId = req.user._id; // Get the user ID from the authenticated user
  
	// Fetch the user's posts from the database
	const userPosts = await Post.find({ user: userId })
	  .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest posts first)
  
	res.status(200).json(userPosts);
  });  

// @desc	Update user post
// Route	PUT  /api/v1/users/posts
// access	Private
const updatePost = asyncHandler(async (req, res) => {
	res.status(200).json({ message: 'Update a Post' });
  });

// @desc	Delete user post
// Route	DELETE  /api/v1/users/posts
// access	Private
const deletePost = asyncHandler(async (req, res) => {
	res.status(200).json({ message: 'Delete Post' });
  });

export { createPost, getAllPosts, getUserPosts, updatePost, deletePost };
