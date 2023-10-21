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
import {postResource, getResources, deleteResource} from '../utils/resourceLogic.js';

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

// @desc  Verify a user's account
// Route GET /api/v1/users/verifyAccount
// Access Private
const verifyAccount = asyncHandler(async (req, res) => {
  const { username, matricNumber, studentEmail } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  if (user) {
    // Check if the user has already been verified
    if (user.isVerified) {
      res.status(400);
      throw new Error('User already verified');
    }
    // Append the user's matric number and student email to the user's data
    user.matricNumber = matricNumber;
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
  req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  res.status(201).json({ code: req.app.locals.OTP })
});

// @desc  Verify OTP
// Route GET /api/v1/users/verifyOTP
// Access Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // Reset the OTP
    req.locals.resetSession = true; // Set the reset password session to true
    return res.status(201).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// @desc  Create a password reset session
// Route GET /api/v1/users/createResetSession
// Access Public
const createResetSession = asyncHandler(async (req, res) => {
  if (req.locals.resetSession) {
    req.locals.resetSession = false; // Allow access to the route only once
    return res.status(201).json({ message: 'Create a password reset session' });
  }
  res.status(440).send({error: 'Session expired'});
});

// @desc  Reset user password
// Route PUT /api/v1/users/resetPassword
// Access Public
const resetPassword = asyncHandler(async (req, res) => {
  try {
    if (!req.locals.resetSession)
    return res.status(440).send({ error: 'Session expired' });

    const { username, password } = req.body;
    
    try {
      
      User.findOne({ username })
      .then(user => {
        bcrypt.hash(password, 10)
        .then(hashedPassword => {
          User.updateOne({ email : user.username }, { password: hashedPassword }, function(err, result) {
            if (err) throw err;
            req.locals.resetSession = false;
            return res.status(200).send({ message: 'Password updated successfully' });
          })
          .then(() => res.status(200).send({ message: 'Password reset successfully' }))
          .catch(err => res.status(500).send({ error: 'Failed to reset password' }));
        })
      })
      .catch(err => res.status(404).send({ error: 'User not found' }));

    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
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

// @desc  Get user by username
// Route GET /api/v1/users/:username
// Access Public
const getUserByUsername = asyncHandler(async (req, res) => {
  const username = req.params.username;

  // Find the user by username
  const user = await User.findOne({ username });

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
    user.matricNumber = req.body.matricNumber || user.matricNumber;
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
    console.log("Fetching payments for user: ", userId);
	  const userPayments = await Payment.find({ user: userId }).sort({ createdAt: -1 });
  
	  if (!userPayments) {
		res.status(404).json({ message: "No payments found for this user." });
	  } else {
		res.status(200).json(userPayments);
		console.log("Got user payments successfully: ", userPayments.length);
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
  try {
    await initiatePayment(req, res);
  } catch (error) {
    console.log(error);
  }
});

const verifyUserPayment = asyncHandler(async (req, res) => {
  try {
    await verifyPayments(req, res);
  } catch (error) {
    console.log(error);
  }
});



export {
  authUser,
  registerUser,
  verifyAccount,
  generateOTP,
  verifyOTP,
  createResetSession,
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
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayments,
  getPaymentOptions,
  verifyUserPayment
};