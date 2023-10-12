import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
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

	// Increase the user's points by 10
	user.points += 10;
  
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
// @desc Toggle upvote on a post
// Route PUT /api/v1/posts/:postId/upvote
// Access Private
const upvotePost = asyncHandler(async (req, res) => {
	const postId = req.params.postId;
	const userId = req.user._id;

	// Find the post by ID
	const post = await Post.findById(postId);

	if (post) {
		// Check if the user has already upvoted the post
		const upvotedIndex = post.upvotes.indexOf(userId);
		const downvotedIndex = post.downvotes.indexOf(userId);

		if (downvotedIndex !== -1) {
			// The user has already downvoted the post, so remove their ID from the downvotes array.
			post.downvotes.splice(downvotedIndex, 1);
		}

		if (upvotedIndex === -1) {
			// The user hasn't upvoted the post, so add their ID to the upvotes array.
			post.upvotes.push(userId);
		}

		await post.save();
		res.status(200).json(post);
	} else {
		res.status(404);
		throw new Error('Post not found');
	}
});

// @desc Toggle downvote on a post
// Route PUT /api/v1/posts/:postId/downvote
// Access Private
const downvotePost = asyncHandler(async (req, res) => {
	const postId = req.params.postId;
	const userId = req.user._id;

	// Find the post by ID
	const post = await Post.findById(postId);

	if (post) {
		// Check if the user has already downvoted the post
		const upvotedIndex = post.upvotes.indexOf(userId);
		const downvotedIndex = post.downvotes.indexOf(userId);

		if (upvotedIndex !== -1) {
			// The user has already upvoted the post, so remove their ID from the upvotes array.
			post.upvotes.splice(upvotedIndex, 1);
		}

		if (downvotedIndex === -1) {
			// The user hasn't downvoted the post, so add their ID to the downvotes array.
			post.downvotes.push(userId);
		}

		await post.save();
		res.status(200).json(post);
	} else {
		res.status(404);
		throw new Error('Post not found');
	}
});

export { createPost, getAllPosts, getUserPosts, updatePost, deletePost, upvotePost, downvotePost };
