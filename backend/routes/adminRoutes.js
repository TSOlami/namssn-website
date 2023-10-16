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
  createCategory,
  deleteCategory,
  editCategory,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/adminController.js';

// Define admin routes and protect them with admin middleware

// Get all users payments
router.route('/all-payments').get(protect, isAdmin, getAllPayments);
//create, Edit and Delete payments
router
.route('/payment')
.post(protect, isAdmin, createCategory)
.put(protect, isAdmin, editCategory)
.delete(protect, isAdmin, deleteCategory);

// Get, create, update and delete user blogs
router
.route('/blog')
.get(protect, isAdmin, getUserBlogs)
.post(protect, isAdmin, createBlog)
.put(protect,isAdmin, updateBlog)
.delete(protect, isAdmin, deleteBlog);

// CRUD routes for Announcements
router
  .route('/announcements')
  .get(protect, isAdmin, getAllAnnouncements) // Get all announcements
  .post(protect, isAdmin, createAnnouncement) // Create a new announcement
  .put(protect, isAdmin, updateAnnouncement) // Update an announcement
  .delete(protect, isAdmin, deleteAnnouncement); // Delete an announcement

// CRUD routes for Events
router
  .route('/events')
  .get(protect, isAdmin, getAllEvents) // Get all events
  .post(protect, isAdmin, createEvent) // Create a new event
  .put(protect, isAdmin, updateEvent) // Update an event
  .delete(protect, isAdmin, deleteEvent); // Delete an event

export default router;
