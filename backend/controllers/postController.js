import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import PostComment from '../models/postCommentModel.js';
import Notification from '../models/notificationModel.js';

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

	// Retrieve the post from the database and populate the `user` field
  const savedPost = await Post.findById(createdPost._id).populate('user', '-password');
  
	res.status(201).json(savedPost);
  });
  
// @desc Get all posts; optional sort: "recent" (default) or "recommended" (by engagement)
// Route GET /api/v1/users/posts?page=1&pageSize=10&sort=recommended
// Access Public
const getPosts = asyncHandler(async (req, res) => {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
	const sortMode = (req.query.sort === 'recommended') ? 'recommended' : 'recent';
	const skip = (page - 1) * pageSize;

	try {
		let posts;
		const totalCount = await Post.countDocuments();

		if (sortMode === 'recommended') {
			// Simple recommendation: sort by engagement (upvotes - downvotes) then by recency
			posts = await Post.aggregate([
				{ $addFields: { engagementScore: { $subtract: [{ $size: { $ifNull: ['$upvotes', []] } }, { $size: { $ifNull: ['$downvotes', []] } }] } } },
				{ $sort: { engagementScore: -1, createdAt: -1 } },
				{ $skip: skip },
				{ $limit: pageSize },
				{ $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userDoc', pipeline: [{ $project: { password: 0 } }] } },
				{ $unwind: '$userDoc' },
				{ $set: { user: '$userDoc' } },
				{ $project: { userDoc: 0, engagementScore: 0 } },
			]);
		} else {
			posts = await Post.find()
				.populate('user', '-password')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.lean();
		}

		const totalPages = Math.ceil(totalCount / pageSize);
		res.status(200).json({ page, pageSize, totalPages, totalCount, posts });
	} catch (error) {
		console.error('Error fetching posts:', error);
		res.status(500).json({ message: 'Server error while fetching posts.' });
	}
});

// @desc Get feed (posts + unread notifications count) in one request. Reduces round trips when frontend/backend on different servers.
// Route GET /api/v1/users/feed?page=1&pageSize=10&sort=recommended
// Access Private (Requires authentication)
const getFeed = asyncHandler(async (req, res) => {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 10));
	const sortMode = (req.query.sort === 'recommended') ? 'recommended' : 'recent';
	const skip = (page - 1) * pageSize;

	try {
		const totalCount = await Post.countDocuments();

		let posts;
		if (sortMode === 'recommended') {
			posts = await Post.aggregate([
				{ $addFields: { engagementScore: { $subtract: [{ $size: { $ifNull: ['$upvotes', []] } }, { $size: { $ifNull: ['$downvotes', []] } }] } } },
				{ $sort: { engagementScore: -1, createdAt: -1 } },
				{ $skip: skip },
				{ $limit: pageSize },
				{ $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userDoc', pipeline: [{ $project: { password: 0 } }] } },
				{ $unwind: '$userDoc' },
				{ $set: { user: '$userDoc' } },
				{ $project: { userDoc: 0, engagementScore: 0 } },
			]);
		} else {
			posts = await Post.find()
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(pageSize)
				.populate('user', '-password')
				.lean();
		}

		const unreadNotificationsCount = await Notification.countDocuments({
			user: req.user._id,
			seen: false,
		});

		const totalPages = Math.ceil(totalCount / pageSize);
		res.status(200).json({
			page,
			pageSize,
			totalPages,
			totalCount,
			posts,
			unreadNotificationsCount,
		});
	} catch (error) {
		console.error('Error fetching feed:', error);
		res.status(500).json({ message: 'Server error while fetching feed.' });
	}
});

// @desc Get a post by ID
// Route GET /api/v1/users/posts/:postId
// Access Public
const getPostById = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.params.postId;

	// Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId)
	.populate({
		path: 'comments',
		model: 'PostComment',
		populate: {
			path: 'user',
			model: 'User',
			select: '-password',
		},
	})
	.populate({
		path: 'user',
		select: '-password',
	});

	// If the post is not found, return an error
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}

	res.status(200).json(post);
});

// @desc Get user's posts (My Posts)
// Route GET /api/v1/users/posts
// Access Private
const getUserPosts = asyncHandler(async (req, res) => {
	try {
	  const userId = req.params.userId; // Get the user ID from the query parameters
  
	  // Fetch the user's posts from the database
	  const userPosts = await Post.find({ user: userId })
			.sort({ createdAt: -1 })
			.populate('user', '-password');
  
	  if (!userPosts) {
		res.status(404).json({ message: "No posts found for this user." });
	  } else {
		res.status(200).json(userPosts);
	  }
	} catch (error) {
	  console.error("Error fetching user posts:", error);
	  res.status(500).json({ message: "Server error while fetching user posts." });
	}
});

// @desc	Update user post
// Route	PUT  /api/v1/users/posts
// access	Private
const updatePost = asyncHandler(async (req, res) => {
	// Extract the post ID from the request parameters
	const postId = req.params.postId;
  
	// Find the post by its ID
	const post = await Post.findById(postId).populate('user', '-password');
  
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
	// Check if the user who made the request is the owner of the post, or if they are an admin
	if (post.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
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

  // Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId).populate('user', '-password');

  if (post) {
    // Check if the user has already upvoted the post
    const upvotedIndex = post.upvotes.indexOf(userId);
    const downvotedIndex = post.downvotes.indexOf(userId);

    if (downvotedIndex !== -1) {
      // The user has already downvoted the post, so remove their ID from the downvotes array.
      post.downvotes.splice(downvotedIndex, 1);

      // Deduct 2 points for removing a downvote
      const user = await User.findById(post.user);
      if (user) {
        user.points -= 2;
        await user.save();
      }
    }

				
		if (upvotedIndex !== -1) {
			// The user has already upvoted the post, so remove their ID from the upvotes array.
			post.upvotes.splice(upvotedIndex, 1);

			// Deduct 5 points for removing an upvote
			const user = await User.findById(post.user);
			if (user) {
				user.points -= 5;
				await user.save();
			}
		} else {
			// The user hasn't upvoted the post, so add their ID to the upvotes array.
			post.upvotes.push(userId);

			// Add 5 points for upvoting
			const user = await User.findById(post.user);
			if (user) {
				user.points += 5;
				await user.save();
			}

			if (post.user.username !== req.user.username) {
				// Create a notification for the post owner
				const notification = new Notification({
					text: `${req.user.username} upvoted your post.`,
					upvote: true,
					user: post.user, // ID of the post owner
					triggeredBy: req.user._id, // ID of the user who triggered the notification
					post: postId,
				});
				await notification.save();
			}
		}

		await post.save();

    res.status(200).json({
      message: "success",
      post,
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

	// Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId).populate('user', '-password');

	if (post) {
		// Check if the user has already downvoted the post
		const upvotedIndex = post.upvotes.indexOf(userId);
		const downvotedIndex = post.downvotes.indexOf(userId);

		if (upvotedIndex !== -1) {
			// The user has already upvoted the post, so remove their ID from the upvotes array.
			post.upvotes.splice(upvotedIndex, 1);

			// Deduct 5 points for removing an upvote
			const user = await User.findById(post.user);
			if (user) {
			  user.points -= 5;
			  await user.save();
			}
		}

		if (downvotedIndex !== -1) {
			// The user has already downvoted the post, so remove their ID from the downvotes array.
			post.downvotes.splice(downvotedIndex, 1);

			// Add 2 points for removing a downvote
			const user = await User.findById(post.user);
			if (user) {
			  user.points += 2;
			  await user.save();
			}
		} else {
			// The user hasn't downvoted the post, so add their ID to the downvotes array.
			post.downvotes.push(userId);

			// Deduct 2 points for downvoting
			const user = await User.findById(post.user);
			if (user) {
				user.points -= 2;
				await user.save();
			}

			if (post.user.username !== req.user.username) {
				// Create a notification for the post owner
				const notification = new Notification({
					text: `${req.user.username} downvoted your post.`,
					downvote: true,
					user: post.user, // ID of the post owner
					triggeredBy: req.user._id, // ID of the user who triggered the notification
					post: postId,
				});
				await notification.save();
			}
		}

		await post.save();
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
	const post = await Post.findById(postId).populate('user', '-password');
  
	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Retrieve the comments associated with the post
	const comments = await PostComment.find({ post: postId }).populate({ path: 'user', select: '-password' });
  
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
  
	// Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId).populate('user', '-password');

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

	// Update the post's comments array
	post.comments.push(createdComment._id);
	await post.save();

	if (post.user.username !== req.user.username) {
		// Create a notification for the post owner
		const notification = new Notification({
			text: `${req.user.username} commented on your post.`,
			user: post.user, // ID of the post owner
			triggeredBy: req.user._id, // ID of the user who triggered the notification
			post: postId,
			comment: true,
		});
		await notification.save();
  }
  
	res.status(201).json({
    message: "success",
    createdComment
  });
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
  
	// Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId).populate('user', '-password');

	if (!post) {
	  res.status(404);
	  throw new Error('Post not found');
	}
  
	// Find the comment by its ID
	const comment = await PostComment.findById(commentId).populate('user', '-password');
  
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
	await PostComment.deleteOne({ _id: commentId });
  
	// Save the updated post
	await post.save();

	if (post.user.username !== req.user.username) {
		// Create a notification for the post owner
		const notification = new Notification({
			text: `${req.user.name} deleted their comment on your post.`,
			comment: true,
			user: post.user, // ID of the post owner
			triggeredBy: req.user._id, // ID of the user who triggered the notification
			post: postId,
		});
		await notification.save();
	}
  
	res.status(200).json({ message: "success" });
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
  
	// Find the post by ID and populate the user information excluding the password field
  const post = await Post.findById(postId).populate('user', '-password');
 
	if (post) {
	  // Find the comment by ID
	  const comment = await PostComment.findById(commentId).populate('user', '-password');
  
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
  
		if (upvotedIndex !== -1) {
			// The user has already upvoted the comment, so remove their ID from the upvotes array.
			comment.upvotes.splice(upvotedIndex, 1);

			// Deduct 5 points for removing an upvote
			const user = await User.findById(comment.user);
			if (user) {
				user.points -= 5;
				await user.save();
			}
		} else {
			// The user hasn't upvoted the comment, so add their ID to the upvotes array.
			comment.upvotes.push(userId);

			// Add 5 points for upvoting
			const user = await User.findById(comment.user);
			if (user) {
				user.points += 5;
				await user.save();
			}

			if (post.user.username !== req.user.username) {
				// Create a notification for the comment owner
				const notification = new Notification({
					text: `${req.user.username} upvoted your comment.`,
					upvote: true,
					user: comment.user, // ID of the comment owner
					triggeredBy: req.user._id, // ID of the user who triggered the notification
					post: postId,
					comment: true,
				});
				await notification.save();
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
	const post = await Post.findById(postId).populate('user', '-password');
  
	if (post) {
	  // Find the comment by ID
	  const comment = await PostComment.findById(commentId).populate('user', '-password');
  
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

		if (downvotedIndex !== -1) {
			// The user has already downvoted the comment, so remove their ID from the downvotes array.
			comment.downvotes.splice(downvotedIndex, 1);

			// Add 2 points for removing a downvote
			const user = await User.findById(comment.user);
			if (user) {
			  user.points += 2;
			  await user.save();
			}
		} else {
			// The user hasn't downvoted the comment, so add their ID to the downvotes array.
			comment.downvotes.push(userId);

			// Deduct 2 points for downvoting
			const user = await User.findById(comment.user);
			if (user) {
				user.points -= 2;
				await user.save();
			}

			if (post.user.username !== req.user.username) {
				// Create a notification for the comment owner
				const notification = new Notification({
					text: `${req.user.username} downvoted your comment.`,
					downvote: true,
					user: comment.user, // ID of the comment owner
					triggeredBy: req.user._id, // ID of the user who triggered the notification
					post: postId,
					comment: true,
				});
				await notification.save();
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
 * @desc Get all notifications for the currently logged-in user.
 * @route GET /api/v1/users/notifications
 * @access Private (Requires authentication)
 */
const getNotifications = asyncHandler(async (req, res) => {
  try {
    // Fetch notifications from the database and populate the "user" field
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "triggeredBy",
        select: "-password", // Exclude the password field
      });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @desc Mark all notifications as seen.
 * @route PUT /api/v1/users/notifications
 * @access Private (Requires authentication)
 */
const markNotificationsAsSeen = asyncHandler(async (req, res) => {
	const notificationId = req.body.notificationId;

	// Find the notification by its ID
	const notification = await Notification.findById(notificationId);

	if (!notification) {
	  res.status(404);
	  throw new Error('Notification not found');
	}

	// Check if the user who made the request is the owner of the notification (or has the required privileges)
	if (notification.user.toString() !== req.user._id.toString()) {
	  res.status(403);
	  throw new Error('Permission denied');
	}

	// Update the notification's "seen" field
	notification.seen = true;

	// Save the updated notification to the database
	await notification.save();

	res.status(200).json({ message: "success" });
});

/**
 * @desc Delete a notification.
 * @route DELETE /api/v1/users/notifications/:notificationId
 * @access Private (Requires authentication)
 */
const deleteNotification = asyncHandler(async (req, res) => {
	// Extract the notification ID from the request parameters
	const notificationId = req.params.notificationId;
	
	// Find the notification by its ID
	const notification = await Notification.findById(notificationId);
	
	if (!notification) {
	  res.status(404);
	  throw new Error('Notification not found');
	}
	
	// Check if the user who made the request is the owner of the notification (or has the required privileges)
	if (notification.user.toString() !== req.user._id.toString()) {
	  res.status(403);
	  throw new Error('Permission denied');
	}
	
	// Remove the notification from the database
	await Notification.deleteOne({ _id: notificationId });
	
	res.status(200).json({ message: "success" });
	}
);

/**
 * @desc Clear all notifications.
 * @route DELETE /api/v1/users/notifications
 * @access Private (Requires authentication)
 */
const clearNotifications = asyncHandler(async (req, res) => {
  try {
    // Remove all notifications for the currently logged-in user
    await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("Failed to clear notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

export { createPost, getPosts, getFeed, getPostById, getUserPosts, updatePost, deletePost, upvotePost, downvotePost, getPostComments, createPostComment, updatePostComment, deletePostComment, upvoteComment, downvoteComment, getNotifications, markNotificationsAsSeen, deleteNotification, clearNotifications };
