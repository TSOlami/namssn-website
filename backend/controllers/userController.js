import asyncHandler from 'express-async-handler';
import generateToken from '../utils.js/generateToken.js';
import { initiatePayment, getAllPayments } from '../utils.js/paymentLogic.js'
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Event from '../models/eventModel.js';
import Announcement from '../models/announcementModel.js';
import Blog from '../models/blogModel.js';

import {postResource, getResources, deleteResource} from '../utils.js/resourceLogic.js';

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
      email: user.email,
      studentEmail: user.studentEmail,
      matricNumber: user.matricNumber,
      bio: user.bio,
      role: user.role,
      level: user.level,
      isVerified: user.isVerified,
      points: user.points,
      profilePicture: user.profilePicture,
      posts: user.posts,
      blogs: user.blogs,
      payments: user.payments,
      resources: user.resources,
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
  const { name, username, email, password, role, level, profilePicture } = req.body;
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
    level,
    profilePicture,
  });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      isVerified: user.isVerified,
      points: user.points,
      profilePicture: user.profilePicture,
      bio: user.bio,
      posts: user.posts,
      blogs: user.blogs,
      payments: user.payments,
      resources: user.resources,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data')
  }
});

// @desc	Logout user
// Route	post  /api/v1/users/logout
// access	Private
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
    isVerified: req.user.isverified,
    points: req.user.points,
    bio: req.user.bio,
    role: req.user.role,
    level: req.user.level,
    profilePicture: req.user.profilePicture,
    posts: req.user.posts,
    blogs: req.user.blogs,
    payments: req.user.payments,
    resources: req.user.resources,
  }
  res.status(200).json(user);
});

// @desc Get user by ID
// Route GET /api/v1/users/:userId
// Access Private
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  // Find the user by ID
  const user = await User.findById(userId);

  if (user) {
    // Return the user data
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      studentEmail: user.studentEmail,
      matricNumber: user.matricNumber,
      bio: user.bio,
      role: user.role,
      level: user.level,
      isVerified: user.isVerified,
      points: user.points,
      profilePicture: user.profilePicture,
      posts: user.posts,
      blogs: user.blogs,
      payments: user.payments,
      resources: user.resources,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
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
    user.level = req.body.level || user.level;

    // Check for studentEmail and matricNumber changes
    if (req.body.studentEmail !== user.studentEmail || req.body.matricNumber !== user.matricNumber) {
      // If either studentEmail or matricNumber has changed, set isVerified to true.
      user.isVerified = true;
      user.role = 'admin';
    }
    
    user.studentEmail = req.body.studentEmail || user.studentEmail;
    user.matricNumber = req.body.matricNumber || user.matricNumber;
    user.bio = req.body.bio || user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

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
      studentEmail: updatedUser.studentEmail,
      matricNumber: updatedUser.matricNumber,
      bio: updatedUser.bio,
      role: updatedUser.role,
      level: updatedUser.level,
      isVerified: updatedUser.isVerified,
      points: updatedUser.points,
      profilePicture: updatedUser.profilePicture,
      posts: updatedUser.posts,
      blogs: updatedUser.blogs,
      payments: updatedUser.payments,
      resources: updatedUser.resources,
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

// @desc Create user resources
// Route POST /api/v1/users/resources
// Access Private

const postUserResources = asyncHandler(async (req, res) => {
  try {
    await postResource(req, res);
  } catch (err) {
    console.log(err)
  }
  res.status(200).send('')
});

// Get All Events
const getAllEvents = asyncHandler(async (req, res) => {
  // Fetch all events from the event model
  const allEvents = await Event.find().populate('user');

  res.status(200).json(allEvents);
});

// Get All Announcements
const getAllAnnouncements = asyncHandler(async (req, res) => {
  // Fetch all announcements from the announcement model
  const allAnnouncements = await Announcement.find().populate('user');

  res.status(200).json(allAnnouncements);
});

// Get User's Announcements (My Announcements)
const getUserAnnouncements = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's announcements from the database
  const userAnnouncements = await Announcement.find({ user: userId }).sort({ createdAt: -1 }); // Sort by creation date in descending order (latest first)

  res.status(200).json(userAnnouncements);
});

// @desc Get all blogs and sort by timestamp
// Route GET /api/v1/users/blogs
// Access Public
const getAllBlogs = asyncHandler(async (req, res) => {
  // Fetch all blogs from the database and sort by timestamp in descending order
  const allBlogs = await Blog.find()
    .populate('user') // 'user' is the field referencing the user who posted the blog
    .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(allBlogs);
});
// Route GET /api/v1/users/blog
// Access Public
const getUserBlogs = asyncHandler(async (req, res) => {
  // Fetch all blogs from the database and sort by timestamp in descending order
  const userBlogs = await Blog.find({ user: req.user._id })
    .populate('user') // 'user' is the field referencing the user who posted the blog
    .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest blogs first)
  
  res.status(200).json(userBlogs);
});


// @desc	Get user resources
// Route	GET  /api/v1/users/Resources
// access	Private
const getUserResources = asyncHandler(async (req, res) => {
  try {
    const fileList = await getResources(req, res);
    res.json(fileList);
  } catch (err) {
    console.log(err);
  }
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
  // res.status(200).json({ message: 'Delete a Resource' });
    try {
      const response = await deleteResource(req, res);
      if (response === "Access Approved") {
        res.status(200).send(response)
      } else if (response === "Access Denied") {
        res.status(200).send(response);
      }
    } catch (err) {
      console.log(err)
    }
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
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  getAllEvents,
  getAllAnnouncements,
  getUserAnnouncements,
  getAllBlogs,
  getUserBlogs,
  postUserResources,
  getUserResources,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayment,
};