import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Payment from '../models/paymentModel.js';
import Blog from '../models/blogModel.js';
import { isAdmin } from '../middleware/authMiddleware.js';

// @desc Get all payments for all users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getAllPayments = asyncHandler(async (req, res) => {
  // Fetch all payment records from the payment model
  const allPayments = await Payment.find().populate('user');

  res.status(200).json(allPayments);
});

// @desc Create a new payment
// Route POST /api/v1/admin/payments
// Access Private (only accessible to admin users)  
const createPayment = asyncHandler(async(req, res) =>  {
  const { category, session, amount }= req.body;
  const addPayment = new Payment(
    {
      category,
      session,
      amount,
      // user: 
    }
  )
  const createdPayment = await addPayment.save();
  res.status(201).json(createPayment)
});

// @desc Get a single payment
// Route GET /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const editPayment = asyncHandler(async (req, res) => {
  const paymentId = req.params.id; // Extract payment ID from the request parameters
  const { category, session, amount } = req.body;

  // Find the payment by its ID
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Update payment properties
  payment.category = category;
  payment.session = session;
  payment.amount = amount;

  // Save the updated payment
  const updatedPayment = await payment.save();

  res.status(200).json(updatedPayment);
});

// @desc Delete a single payment
// Route DELETE /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const deletePayment = asyncHandler(async (req, res) => {
  const paymentId = req.params.id; // Extract payment ID from the request parameters

  // Find the payment by its ID
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Remove the payment from the database
  await payment.remove();

  res.status(204).json({ message: 'Payment removed' });
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

export {
  getAllPayments,
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  createPayment,
  editPayment,
  deletePayment,
};
