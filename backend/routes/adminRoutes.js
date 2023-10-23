import express from 'express';

// Create an instance of an Express Router to define admin routes.
const router = express.Router();

// Import middleware for authentication and authorization.
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Import controllers for admin operations.
import {
  getAllPayments,
  getPaymentStatus,
  getUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  createCategory,
  deleteCategory,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  updateEvent,
  deleteEvent,
  makeUserAdmin,
  removeAdmin
} from '../controllers/adminController.js';

// Define admin routes and protect them with admin middleware

// Make a user an admin
router.route('/make-admin/:userId').put(protect, isAdmin, makeUserAdmin);

// Remove admin privileges from a user
router.route('/remove-admin/:userId').put(protect, isAdmin, removeAdmin);

// Get all users payments
router.route('/all-payments').get(protect, isAdmin, getAllPayments);
//create, Edit and Delete payments
router
.route('/payment')
.post(protect, isAdmin, createCategory)
.get(protect, isAdmin, getPaymentStatus)
.delete(protect, isAdmin, deleteCategory);

// Get, create, update and delete user blogs
router
.route('/blog')
.get(protect, isAdmin, getUserBlogs)
.post(protect, isAdmin, createBlog)
.put(protect, isAdmin, updateBlog)

router
.route('/blog/:blogId')
.delete(protect, isAdmin, deleteBlog);

/**
 * @description POST, PUT and DELETE operations for announcements
 * @route /api/admin/events
 * @access Private/Admin
 */
router
  .route('/announcement')
  .post(protect, isAdmin, createAnnouncement) // Create a new announcement
  .put(protect, isAdmin, updateAnnouncement) // Update an announcement
  .delete(protect, isAdmin, deleteAnnouncement); // Delete an announcement

/**
 * @description POST, PUT and DELETE operations for events
 * @route /api/admin/events
 * @access Private/Admin
 */
  router
  .route('/events')
  .post(protect, isAdmin, createEvent) // Create a new event
  .put(protect, isAdmin, updateEvent) // Update an event
  .delete(protect, isAdmin, deleteEvent); // Delete an event

export default router;
