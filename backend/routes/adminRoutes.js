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
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createEvent,
  updateEvent,
  deleteEvent,
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

/**
 * @description POST, PUT and DELETE operations for announcements
 * @route /api/admin/events
 * @access Private/Admin
 */
router
  .route('/announcements')
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
