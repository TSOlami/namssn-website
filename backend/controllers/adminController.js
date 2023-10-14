import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';
import Payment from '../models/paymentModel.js';
import Blog from '../models/blogModel.js';
import { isAdmin } from '../middleware/authMiddleware.js';

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
const createCategory = asyncHandler(async(req, res) =>  {
  const { name, session, amount }= req.body;
  const addCategory = new Category(
    {
      name,
      session,
      amount,
    }
  )
  const craetedCategory = await addCategory.save();
  res.status(201).json(craetedCategory)
});

// @desc edit a single payment category
// Route GET /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const editCategory = asyncHandler(async (req, res) => {
    const { name, session, amount } = req.body;
    const categoryName = req.params.name; // Extract category ID from the request parameters

  // Find the category by its ID
  const category  = await Category.findById(categoryName);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Update category properties
  category.name = name;
  category.session = session;
  category.amount = amount;

  // Save the updated category
  const updatedCategory = await category.save();

  res.status(200).json(updatedCategory);
});

// @desc Delete a single payment category
// Route DELETE /api/v1/admin/payments/:id
// Access Private (only accessible to admin users)
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.name; // Extract payment ID from the request parameters

  // Find the payment by its ID
  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Remove the payment from the database
  await category.remove();

  res.status(204).json({ message: 'category removed' });
});

// @desc Get all payments for all users
// Route GET /api/v1/admin/payments
// Access Private (only accessible to admin users)
const getAllPayments = asyncHandler(async (req, res) => {
  // Fetch all payment records from the payment model
  const allPayments = await Payment.find().populate('user');

  res.status(200).json(allPayments);
});




export {
  getAllPayments,
  createBlog,
  getUserBlogs,
  updateBlog,
  deleteBlog,
  createCategory,
  editCategory,
  deleteCategory,
};
