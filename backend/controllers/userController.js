import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import { initiatePayment, getAllPayments } from '../utils/paymentLogic.js'
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Blog from '../models/blogModel.js';



// @desc	Authenticate user/set token
// Route	post  /api/v1/users/auth
// access	Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password')
  }
});

// @desc	Resgister a new user/set token
// Route	post  /api/v1/users
// access	Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, role } = req.body;
  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    res.status(400);
    throw new Error('Email or username already exists');
  }

  // By default, set the user's role to "user" if it's not specified
  const userRole = role || 'user';

  const user = await User.create({
    name,
    username,
    email,
    password,
    role: userRole,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data')
  }
});

// @desc	Logout user
// Route	post  /api/v1/users/logout
// access	Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'User Logged Out' });
});

// @desc	Get user profile
// Route	GET  /api/v1/users/profile
// access	Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    username: req.user.username,
    studentEmail: req.user.studentEmail,
    verified: req.user.verified,
    points: req.user.points,
  }
  res.status(200).json(user);
});

// @desc	Update user profile
// Route	PUT  /api/v1/users/profile
// access	Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Check if the new email already exists in the database
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
      }
    }

    // Check if the new username already exists in the database
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username already exists');
      }
    }

    // Update user profile fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.studentEmail = req.body.studentEmail || user.studentEmail;

    if (req.body.password) {
      user.password = req.body.password;
      res.status(200).json({ message: 'Password updated successfully' });
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Delete a user account
// Route DELETE /api/v1/users/profile
// Access Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Perform any necessary cleanup or data removal associated with the user
    // ...

    // Remove the user from the database
    await user.remove();

    // Respond with a success message
    res.status(200).json({ message: 'User account deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc Create a new post
// Route POST /api/v1/users/posts
// Access Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // You can access the currently logged-in user's information from req.user
  const userId = req.user._id;

  // Create a new post
  const newPost = new Post({
    title,
    content,
    user: userId, // Associate the post with the user who created it
  });

  // Save the new post to the database
  const createdPost = await newPost.save();

  res.status(201).json(createdPost);
});

// @desc Get all posts and sort by timestamp
// Route GET /api/v1/user/posts
// Access Public
const getAllPosts = asyncHandler(async (req, res) => {
  // Fetch all posts from the database and sort by timestamp in descending order
  const allPosts = await Post.find()
    .populate('user') // 'user' is the field referencing the user who posted the post
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest posts first)

  res.status(200).json(allPosts);
});

// @desc Get user's posts (My Posts)
// Route GET /api/v1/users/posts
// Access Private
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's posts from the database
  const userPosts = await Post.find({ user: userId })
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest posts first)

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

// @desc Create user resources
// Route POST /api/v1/users/resources
// Access Private
const postUserResources = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Post user Resources' });
});

// @desc Get all blogs and sort by timestamp
// Route GET /api/v1/user/blogs
// Access Public
const getAllBlogs = asyncHandler(async (req, res) => {
  // Fetch all blogs from the database and sort by timestamp in descending order
  const allBlogs = await Blog.find()
    .populate('user') // 'user' is the field referencing the user who posted the blog
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(allBlogs);
});

// @desc	Get user resources
// Route	GET  /api/v1/users/Resources
// access	Private
const getUserResources = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'User Resources' });
});

// @desc	Update a user resources
// Route	PUT  /api/v1/users/resources
// access	Private
const updateUserResources = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Update user Resources' });
});

// @desc	Delete user resources
// Route	DELETE  /api/v1/users/resources
// access	Private
const deleteUserResources = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Delete a Resource' });
});

// @desc	Get user payments history
// Route	GET  /api/v1/users/payments
// access	Private
const getUserPayment = asyncHandler(async (req, res) => {
  try {
    await getAllPayments(req, res);
  } catch (error) {
    console.log(error)
  }
  res.status(200).json({ message: 'User payments history' });
});

// @desc	Send a user payments
// Route	POST  /api/v1/users/payments
// access	Private
const postUserPayment = asyncHandler(async (req, res) => {
  try {
    await initiatePayment(req, res);

  } catch (error) {
    console.log(error)

  }
  res.status(200).json({ message: 'Payment sent' });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  createPost,
  getAllPosts,
  getUserPosts,
  updatePost,
  deletePost,
  getAllBlogs,
  postUserResources,
  getUserResources,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayment,
};