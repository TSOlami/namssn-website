import express from 'express';

// Create an instance of an Express Router to define admin routes.
const router = express.Router();

// Import middleware for authentication and authorization.
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Import controllers for admin operations.
import {
  getAllPayments,
  getUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/adminController.js';

// Define admin routes and protect them with admin middleware

// Get all users payments
router.route('/all-payments').get(protect, isAdmin, getAllPayments);

// Get, create, update and delete user blogs
router
.route('/blog')
.get(protect, isAdmin, getUserBlogs)
.post(protect, isAdmin, createBlog)
.put(protect,isAdmin, updateBlog)
.delete(protect, isAdmin, deleteBlog);


export default router;
