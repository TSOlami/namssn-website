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
  console.log(createdPost);
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
  
// UserController.js
// @desc Get user's posts (My Posts)
// Route GET /api/v1/users/posts
// Access Private
const getUserPosts = asyncHandler(async (req, res) => {
	const userId = req.query.userId; // Get the user ID from the query parameters
	
	// Fetch the user's posts from the database
	const userPosts = await Post.find({ user: userId })
	.sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest posts first)
	
	res.status(200).json(userPosts);
	console.log(userPosts);
	console.log("Got user posts successfully");
});

// @desc	Update user post
// Route	PUT  /api/v1/users/posts
// access	Private
const updatePost = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.params.postId;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Check if the user who made the request is the owner of the post (or has the required privileges)
	if (post.user.toString() !== req.user._id.toString()) {
	  res.status(403);
	  throw new Error('Permission denied');
	}
  
	// Update the post with the new data from the request
	post.text = req.body.text; // You can add more fields to update as needed
  
	// Save the updated post
	await post.save();
  
	res.status(200).json(post);
  });

// @desc	Delete user post
// Route	DELETE  /api/v1/users/posts
// access	Private
const deletePost = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.body.postId;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
	// Check if the user who made the request is the owner of the post, or if they are an admin (you can define an admin role as needed)
	if (post.user.toString() === req.user._id.toString() || req.user.isAdmin) {
	  // If the user is the owner of the post or an admin, delete the post
	  await Post.deleteOne({ _id: postId });
	  res.status(200).json({ message: 'success' });
	} else {
	  res.status(403);
	  throw new Error('Permission denied');
	}
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
    console.log("Upvoted post successfully");
		res.status(200).json({
      message: "success",
      post
    });
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
    console.log("Downvoted post successfully");
		res.status(200).json({
      message: "success",
      post
    });
	} else {
		res.status(404);
		throw new Error('Post not found');
	}
});

/**
 * @desc Get all comments for a post.
 * @route GET /api/v1/users/posts/:postId/comments
 * @access Private (Requires authentication)
 */
const getPostComments = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.params.postId;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Retrieve the comments associated with the post
	const comments = await PostComment.find({ post: postId }).populate('user');
  
	res.status(200).json(comments);
});

/**
 * @desc Create a new comment for a post.
 * @route POST /api/v1/users/posts/:postId/comments
 * @access Private (Requires authentication)
 */
const createPostComment = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.params.postId;
  
	// Extract the comment text from the request body
	const { text } = req.body;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Create a new comment
	const newComment = new PostComment({
	  text,
	  user: req.user._id, // Assuming you have user authentication in place
	  post: postId,
	});
  
	// Save the new comment to the database
	const createdComment = await newComment.save();
  
	res.status(201).json({
    message: "success",
    createdComment
  });
  console.log("Created comment successfully");
  });

/**
 * @desc Update a comment for a post.
 * @route PUT /api/v1/users/posts/:postId/comments/:commentId
 * @access Private (Requires authentication)
 */
const updatePostComment = asyncHandler(async (req, res) => {
	// Extract the post ID and comment ID from the request parameters
	const postId = req.params.postId;
	const commentId = req.params.commentId;
  
	// Extract the updated comment text from the request body
	const { text } = req.body;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Find the comment by its ID
	const comment = await PostComment.findById(commentId);
  
	if (!comment) {
	  res.status(404);
	  throw new Error('Comment not found');
	}
  
	// Check if the user who made the request is the owner of the comment (or has the required privileges)
	if (comment.user.toString() !== req.user._id.toString()) {
	  res.status(403);
	  throw new Error('Permission denied');
	}
  
	// Update the comment text
	comment.text = text;
  
	// Save the updated comment to the database
	const updatedComment = await comment.save();
  
	res.status(200).json({
    message: "success",
    updatedComment
  });
  console.log("Updated comment successfully");
  });

/**
 * @desc Delete a comment for a post.
 * @route DELETE /api/v1/users/posts/:postId/comments/:commentId
 * @access Private (Requires authentication)
 */
const deletePostComment = asyncHandler(async (req, res) => {
	// Extract the post ID and comment ID from the request parameters
	const postId = req.params.postId;
	const commentId = req.params.commentId;
  
	// Find the post by its ID
	const post = await Post.findById(postId);
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Find the comment by its ID
	const comment = await PostComment.findById(commentId);
  
	if (!comment) {
	  res.status(404);
	  throw new Error('Comment not found');
	}
  
	// Check if the user who made the request is the owner of the comment (or has the required privileges)
	if (comment.user.toString() !== req.user._id.toString()) {
	  res.status(403);
	  throw new Error('Permission denied');
	}
  
	// Remove the comment from the post's comments array
	const commentIndex = post.comments.indexOf(commentId);
  
	if (commentIndex !== -1) {
	  post.comments.splice(commentIndex, 1);
	}
  
	// Remove the comment from the database
	await Comment.deleteOne({ _id: commentId });
  
	// Save the updated post
	await post.save();
  
	res.status(200).json({ message: "success" });
  console.log("Deleted comment successfully");
  });

/**
 * @desc Toggle upvote on a comment
 * @route PUT /api/v1/posts/:postId/comments/:commentId/upvote
 * @access Private
 */
const upvoteComment = asyncHandler(async (req, res) => {
	// Extract the post ID and comment ID from the request parameters
	const postId = req.params.postId;
	const commentId = req.params.commentId;
	const userId = req.user._id;
  
	// Find the post by ID
	const post = await Post.findById(postId);
  
	if (post) {
	  // Find the comment by ID
	  const comment = await PostComment.findById(commentId);
  
	  if (comment) {
		// Check if the user has already upvoted the comment
		const upvotedIndex = comment.upvotes.indexOf(userId);
		const downvotedIndex = comment.downvotes.indexOf(userId);
  
		if (downvotedIndex !== -1) {
		  // The user has already downvoted the comment, so remove their ID from the downvotes array.
		  comment.downvotes.splice(downvotedIndex, 1);
  
		  // Deduct 2 points for removing a downvote
		  const user = await User.findById(comment.user);
		  if (user) {
			user.points -= 2;
			await user.save();
		  }
		}
  
		if (upvotedIndex === -1) {
		  // The user hasn't upvoted the comment, so add their ID to the upvotes array.
		  comment.upvotes.push(userId);
		  console.log("Upvoting comment: ", comment);
  
		  // Add 5 points for upvoting
		  const user = await User.findById(comment.user);
		  if (user) {
			user.points += 5;
		    console.log("Adding 5 points to user: ", user);
			await user.save();
		  }
		}
  
		await comment.save();
  
		res.status(200).json({ message: "success" });
	  } else {
		res.status(404);
		throw new Error('Comment not found');
	  }
	} else {
	  res.status(404);
	  throw new Error('Post not found');
	}
	  });

/**
 * @desc Toggle downvote on a comment
 * @route PUT /api/v1/posts/:postId/comments/:commentId/downvote
 * @access Private
 */
const downvoteComment = asyncHandler(async (req, res) => {
	// Extract the post ID and comment ID from the request parameters
	const postId = req.params.postId;
	const commentId = req.params.commentId;
	const userId = req.user._id;
  
	// Find the post by ID
	const post = await Post.findById(postId);
  
	if (post) {
	  // Find the comment by ID
	  const comment = await PostComment.findById(commentId);
  
	  if (comment) {
		// Check if the user has already downvoted the comment
		const upvotedIndex = comment.upvotes.indexOf(userId);
		const downvotedIndex = comment.downvotes.indexOf(userId);
  
		if (upvotedIndex !== -1) {
		  // The user has already upvoted the comment, so remove their ID from the upvotes array.
		  comment.upvotes.splice(upvotedIndex, 1);
  
		  // Deduct 5 points for removing an upvote
		  const user = await User.findById(comment.user);
		  if (user) {
			user.points -= 5;
			await user.save();
		  }
		}
  
		if (downvotedIndex === -1) {
		  // The user hasn't downvoted the comment, so add their ID to the downvotes array.
		  comment.downvotes.push(userId);
  
		  // Deduct 2 points for downvoting
		  const user = await User.findById(comment.user);
		  if (user) {
			user.points -= 2;
			await user.save();
		  }
		}
  
		await comment.save();
  
		res.status(200).json({ message: "success" });
	  } else {
		res.status(404);
		throw new Error('Comment not found');
	  }
	} else {
	  res.status(404);
	  throw new Error('Post not found');
	}
});

export { createPost, getAllPosts, getUserPosts, updatePost, deletePost, upvotePost, downvotePost, getPostComments, createPostComment, updatePostComment, deletePostComment, upvoteComment, downvoteComment };
