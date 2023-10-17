import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Payment from '../models/paymentModel.js';
import Blog from '../models/blogModel.js';
import { verifyPayments } from '../utils/paymentLogic.js';


// @desc Make a user an admin
// Route PUT /api/v1/admin/users/makeadmin/:userId
// Access Private (only accessible to admin users)
const makeUserAdmin = asyncHandler(async (req, res) => {
  const userId = req.body.userId;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user is already an admin
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('User is already an admin');
  }

  // Make the user an admin
  user.role = 'admin';

  // Save the updated user
  await user.save();

  res.status(200).json({ message: 'User is now an admin' });
});


// @desc Remove admin privileges from a user
// Route PUT /api/v1/admin/users/removeadmin/:userId
// Access Private (only accessible to admin users)
const removeAdmin = asyncHandler(async (req, res) => {
  const userId = req.body.userId;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user is not an admin
  if (user.role !== 'admin') {
    res.status(400);
    throw new Error('User is not an admin');
  }

  // Remove admin privileges from the user
  user.role = 'user';

  // Save the updated user
  await user.save();

  res.status(200).json({ message: 'User is no longer an admin' });
});


// @desc Create a new blog
// Route POST /api/v1/users/blogs
// Access Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // You can access the currently logged-in user's information from req.user
  const userId = req.user._id;

  // Create a new blog
  const newBlog = new Blog({
    title,
    content,
    user: userId, // Associate the blog with the user who created it
  });

  // Save the new blog to the database
  const createdBlog = await newBlog.save();

  res.status(201).json(createdBlog);
});

// @desc Get user's blogs (My Blogs)
// Route GET /api/v1/users/blogs
// Access Private
const getUserBlogs = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the user ID from the authenticated user

  // Fetch the user's blogs from the database
  const userBlogs = await Blog.find({ user: userId })
    .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest blogs first)

  res.status(200).json(userBlogs);
});

// @desc	Update user blog
// Route	PUT  /api/v1/users/blogs
// access	Private
const updateBlog = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Update a Blog' });
});

// @desc	Delete user blog
// Route	DELETE  /api/v1/users/blogs
// access	Private
const deleteBlog = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Delete Blog' });
});


// @desc Create a new payment category
// Route POST /api/v1/admin/payments
// Access Private (only accessible to admin users)  
const createCategory = asyncHandler(async (req, res) => {
  const { name, session, amount } = req.body;
  const addCategory = new Category(
    {
      name,
      session,
      amount,
    }
  )
  const createdCategory = await addCategory.save();
  res.status(201).json(createdCategory)
});

// @desc Delete a single payment category
// Route DELETE /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const deleteCategory = asyncHandler(async (req, res) => {
  const { name, session, amount } = req.body;

  try {
    // Step 1: Find the category that matches the criteria
    const category = await Category.findOne({ name, amount, session }).exec();

    if (!category) {
      // Step 2: Handle the case where no matching category is found
      return res.status(404).json({ message: 'Category not found' });
    }
    const categoryId = category._id

    // Step 3: If the category is found, remove it
    await Category.deleteOne(categoryId)

    // Step 4: Handle success response
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    // Step 5: Handle any errors that occur during removal
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// @desc Show all payment status for last 10 users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getPaymentStatus = asyncHandler(async (req, res) => {
  try {
    await verifyPayments(req, res);
  } catch (error) {
    console.log(error);
  }
});


// @desc Get all payments for all users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getAllPayments = asyncHandler(async (req, res) => {
  // Fetch all payment records from the payment model
  const allPayments = await Payment.find().populate('user');
  res.status(200).json(allPayments);
  });


  // Save the new announcement to the database

export {
  getAllPayments,
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  createCategory,
  deleteCategory,
  getPaymentStatus,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent,
  makeUserAdmin,
  removeAdmin,
};
