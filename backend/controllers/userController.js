import asyncHandler from 'express-async-handler';
import otpGenerator from 'otp-generator';
import generateToken from '../utils/generateToken.js';
import { initiatePayment, verifyPayments } from '../utils/paymentLogic.js'
import User from '../models/userModel.js';
import Event from '../models/eventModel.js';
import Announcement from '../models/announcementModel.js';
import Blog from '../models/blogModel.js';
import Payment from '../models/paymentModel.js';
import Category from '../models/categoryModel.js';
import UserOTPVerification from '../models/userOTPVerification.js';
import {postResource, getResources, getSpecifiedResources,deleteResource} from '../utils/resourceLogic.js';
import getData from '../utils/searchUtils/getData.js';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import getTelFile from '../utils/botUtils/getTelFile.js';
import { sendOTPEmail } from '../utils/emailService.js';


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

// @desc	Check if email exists
// Route	POST /api/v1/users/check-email
// Access Public
const checkEmailExistence = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if the email exists in the database
    const user = await User.findOne({ email });

    // Return whether the email exists or not
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @desc  Check if student email exists
// Route POST /api/v1/users/check-student-email
// Access Public
const checkStudentEmailExistence = asyncHandler(async (req, res) => {
  try {
    const { studentEmail  } = req.body;
    // Check if the student email exists in the database
    const user = await User.findOne({ studentEmail });

    // Return whether the student email exists or not
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking student email existence:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// @desc  Verify a user's account
// Route GET /api/v1/users/verify-account
// Access Private
const verifyAccount = asyncHandler(async (req, res) => {
  const { username, studentEmail } = req.body;
  // Find the user by username
  const user = await User.findOne({ username });

  if (user) {
    // Check if the user has already been verified
    if (user.isVerified) {
      res.status(400);
      throw new Error('User already verified');
    }

    // Check if the email provided is already in use by another user
    const emailExists = await User.findOne({ email: studentEmail });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }

    // Append the user's matric number and student email to the user's data
    user.studentEmail = studentEmail;
    user.isVerified = true;

    // Save the updated user data
    const updatedUser = await user.save();

    // Return the updated user data
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
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

// @desc  Generate an OTP for user verification
// Route GET /api/v1/users/generateOTP
// Access Public
const generateOTP = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find the user first
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // Save the OTP to the database
    await UserOTPVerification.create({
      username,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    });

    // Set otpGenerated to true
    user.otpGenerated = true;
    await user.save();

    // Send OTP via email directly from the server (secure approach)
    try {
      await sendOTPEmail(user.email, username, otp);
      res.status(201).json({ message: 'OTP sent to your email successfully' });
    } catch (emailError) {
      // If email fails, still return success but log the error
      console.error('Failed to send OTP email:', emailError);
      res.status(201).json({ message: 'OTP generated. Please check your email.' });
    }
  } catch (error) {
    console.error('OTP generation error:', error);
    res.status(400).json({ message: 'Failed to generate OTP' });
  }
});


// @desc  Verify OTP
// @route POST /api/v1/users/verify-otp
// @access Public
const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { username, code } = req.body;

    // Input validation
    if (!username || !code) {
      return res.status(400).json({ message: 'Both username and code are required' });
    }

    // Check if the OTP exists in the database and is not expired
    const otpRecord = await UserOTPVerification.findOne({ username }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid username or OTP not found' });
    }

    // Check if the OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      // Delete the expired OTP record
      await UserOTPVerification.deleteMany({ username });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify the OTP
    const isOTPValid = await otpRecord.matchOtp(code);

    if (isOTPValid) {
      // Delete the matched OTP record
      await UserOTPVerification.deleteMany({ username });

      const user = await User.findOne({ username });

      // Set otpVerified to true
      user.otpVerified = true;
      await user.save();

      // OTP is valid, you can implement further actions here
      return res.status(200).json({ message: 'OTP Verification successful' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
});

// @desc  Resend OTP
// @route POST /api/v1/users/resend-otp
// @access Public
const resendOTP = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;

    // Input validation
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing OTPs and delete them
    await UserOTPVerification.deleteMany({ username });

    // Generate a new OTP
    const otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // Save the OTP to the database
    await UserOTPVerification.create({
      username,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    });

    // Send OTP via email directly from the server (secure approach)
    try {
      await sendOTPEmail(user.email, username, otp);
      res.status(201).json({ message: 'OTP resent to your email successfully' });
    } catch (emailError) {
      console.error('Failed to resend OTP email:', emailError);
      res.status(201).json({ message: 'OTP generated. Please check your email.' });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
});


// @desc  Reset user password
// Route PUT /api/v1/users/reset-password
// Access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Both username and password are required' });
  }

  // Check if the user exists
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if user has generated and verified an OTP
  if (!user.otpGenerated && !user.otpVerified) {
    return res.status(400).json({ message: 'Please generate an OTP and verify to confirm your identity' });
  }

  try {
    // Check if the new password is the same as the old password
    if (await user.matchPassword(password)) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    // Update the user's password
    user.password = password;

    // Reset the user's OTP status
    user.otpGenerated = false;
    user.otpVerified = false;

    // Save the updated user data
    await user.save();

    // Return a success message
    res.status(200).json({ message: 'Password reset successful', email: user.email });
  } catch (error) {
    // Handle any errors that occur while updating the user's password
    console.error(error);
    return res.status(500).json({ message: 'An unexpected error occurred' });
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

// @desc  Search for a user
// Route GET /api/v1/users/search
// Access Private
const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  // Find users whose name or username matches the query
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  });

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('No users found');
  }
});

// @desc	Get user profile
// Route	GET  /api/v1/users/profile
// access	Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password') // Exclude the 'password' field
    .populate('posts'); // Populate the 'posts' field

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

// @desc Get user by ID
// Route GET /api/v1/users/profile/:userId
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

// @desc  Get user by username
// Route GET /api/v1/users/profile/:username
// Access Public
const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;

  // Find the user by username
  const user = await User.findOne({ username }).select('-password').populate('posts');

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
      const emailExists = await User.findOne({ email: req.body.email }).select('-password').populate('posts');
      if (emailExists) {
        res.status(400);
        throw new Error('Email already exists');
      }
    }

    // Check if the new username already exists in the database
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username }).select('-password').populate('posts');
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
    user.matricNumber = req.body.matricNumber || user.matricNumber;
    user.studentEmail = req.body.studentEmail || user.studentEmail;
    user.bio = req.body.bio || user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

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
    await User.deleteOne({ _id: user._id });

    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    });

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
  const response = await postResource(req, res);
  // Check if the response is null
  if (response) {
    if (response === null) {
      res.status(500).send("Unable to upload")
    } else {
      res.json(response)
    }
  }
});

// Get All Events
const getAllEvents = asyncHandler(async (req, res) => {
  // Fetch all events from the event model
  const allEvents = await Event.find().populate('user', '-password');

  res.status(200).json(allEvents);
});

// Get All Announcements
const getAllAnnouncements = asyncHandler(async (req, res) => {
  // Fetch all announcements from the announcement model
  const allAnnouncements = await Announcement.find().populate('user', '-password');

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
    .populate('user', '-password') // 'user' is the field referencing the user who posted the blog
    .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(allBlogs);
});

// Route GET /api/v1/users/blog
// Access Public
const getUserBlogs = asyncHandler(async (req, res) => {
  // Fetch all blogs from the database and sort by timestamp in descending order
  const userBlogs = await Blog.find({ user: req.user._id })
    .populate('user', '-password') // 'user' is the field referencing the user who posted the blog
    .sort({ createdAt: -1 }); // Sort by timestamp in descending order (latest blogs first)
  
  res.status(200).json(userBlogs);
});


// @desc	Get user resources
// Route	GET  /api/v1/users/Resources
// access	Private
const getUserResources = asyncHandler(async (req, res) => {
  const filesDetails = await getResources(req, res);
  if (filesDetails) {
    res.json(filesDetails);
  }
});

// @desc	Get a file
// Route	GET  /api/v1/users/resources/filename
// access	Private
const getFile = asyncHandler(async (req, res) => {
  try {
    const file = await getTelFile(req, res)
    if (file) {
      res.send(file)
    }
  } catch (err) {
    console.error("Error:", err);
    // Handle the error appropriately
    res.status(500).send("Internal Server Error");
  }
})

// @desc	Get resources for a specified level
// Route	GET  /api/v1/users/level/resources
// access	Private
const getSpecifiedLevelResources = asyncHandler(async (req, res) => {
  const level =req.params.level
  try {
    const allResources = await getSpecifiedResources(level)
    if (allResources) {
      res.json(allResources)
    }
  } catch (err) {
    console.log(err)
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
  const response = await deleteResource(req, res);
  if (response === "Access Approved") {
    res.status(200).send(response)
  } else if (response === "Access Denied") {
    res.status(200).send(response);
  }
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
const getUserPayments = asyncHandler(async (req, res) => {
	try {
	  const userId = req.params.userId; // Get the user ID from the query parameters
  
	  // Fetch the user's posts from the database
	  const userPayments = await Payment.find({ user: userId })
    .populate('category')
    .sort({ createdAt: -1 });
  
	  if (!userPayments) {
		res.status(404).json({ message: "No payments found for this user." });
	  } else {
		res.status(200).json(userPayments);
	  }
	} catch (error) {
	  console.error("Error fetching user payments:", error);
	  res.status(500).json({ message: "Server error while fetching user payments." });
	}
});


// @desc	Send a user payments
// Route	POST  /api/v1/users/payments
// access	Private
const postUserPayment = asyncHandler(async (req, res) => {
  await initiatePayment(req, res);
});

const verifyUserPayment = asyncHandler(async (req, res) => {
  await verifyPayments(req, res);
});

const getSearchResults = asyncHandler(async (req, res) => {
  const value = req.query.value;
  const filter = req.query.filter;
  const data = await getData(value, filter)
  res.json(data)
})

export {
  authUser,
  registerUser,
  verifyAccount,
  generateOTP,
  verifyOTP,
  resetPassword,
  logoutUser,
  getUserProfile,
  getUserById,
  getUserByUsername,
  updateUserProfile,
  deleteUserProfile,
  getAllEvents,
  getAllAnnouncements,
  getUserAnnouncements,
  getAllBlogs,
  getUserBlogs,
  postUserResources,
  getUserResources,
  getSpecifiedLevelResources,
  getFile,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayments,
  getPaymentOptions,
  verifyUserPayment,
  resendOTP,
  getSearchResults,
  checkEmailExistence,
  checkStudentEmailExistence,
};