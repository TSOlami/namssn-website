import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Blog from '../models/blogModel.js';
import generateToken from '../utils/generateToken.js';
import checkUploadDirectory from '../utils/checkUploadDirectory.js';
import { initiatePayment, getAllPayments } from '../utils/paymentLogic.js'
import Category from '../models/categoryModel.js';
import * as fs from 'fs';


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
  const {file} = req.files;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  // Define the directory where you want to save the uploaded file
  const uploadDirectory = 'uploads';
  
  checkUploadDirectory(uploadDirectory)
  .then(() => {
    console.log(file.name)
    const uniquefileName = Date.now() + '_' + Math.random().toString(36).substring(7);
    const fileName = uniquefileName + '_' + file.name;
    fs.promises.writeFile(`${uploadDirectory}/${fileName}`, file.data)
    .then(() => {
      console.log("File has been saved successfully");
    }) .catch((err) => {
      console.log(err)
    })
    }) .catch((err) => {
      console.log(err);
    })
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



//@desc Get list of payments added by the admin
// Route GET /api/v1/users/payments
// Access Private
// Get payment options for users
const getPaymentOptions = async (req, res) => {
  try {
    // Example: Fetch a list of admin-added payments from your database
    const category = await Category.find({});

    // Check if there are available payment options
    if (category.length === 0) {
      return res.status(204).json({ message: 'No Category available' });
    }

    // You can further process or format the payment options as needed
    // For now, we'll simply send the list to the user
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category options', error: error.message });
  }
};



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
    console.log(error);
  }
});



export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  getAllBlogs,
  getUserBlogs,
  postUserResources,
  getUserResources,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayment,
  getPaymentOptions
};