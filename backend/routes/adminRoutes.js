import express from 'express';

// Create an instance of an Express Router to define admin routes.
const router = express.Router();

// Import middleware for authentication and authorization.
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// Import controllers for admin operations.
import {
  getAllUsers,
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
  removeAdmin,
  getTotalUsers,
  getTotalPosts,
  getTotalAnnouncements,
  getTotalBlogs,
  getTotalEvents,
  getTotalPayments,

  
} from '../controllers/adminController.js';

// Define admin routes and protect them with admin middleware

// Make a user an admin
router.route('/make-admin/:userId').put(protect, isAdmin, makeUserAdmin);

// Remove admin privileges from a user
router.route('/remove-admin/:userId').put(protect, isAdmin, removeAdmin);

// Get all users
router.route('/all-users').get(protect, isAdmin, getAllUsers);

// Get all users payments
router.route('/all-payments').get(protect, isAdmin, getAllPayments);
// payment status
router.post('/payments/verify', protect, getPaymentStatus);
//create, Edit and Delete payments
router
.route('/payment')
.post(protect, isAdmin, createCategory)
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

router
  .route('/announcement/:announcementId')
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

router
  .route('/events/:eventId')
  .put(protect, isAdmin, updateEvent) // Update an event
  .delete(protect, isAdmin, deleteEvent); // Delete an event

// Get total number of users
router.route('/total-users').get(protect, isAdmin, getTotalUsers);

// Get total number of posts
router.route('/total-posts').get(protect, isAdmin, getTotalPosts);

// Get total number of announcements
router.route('/total-announcements').get(protect, isAdmin, getTotalAnnouncements);

// Get total number of blogs
router.route('/total-blogs').get(protect, isAdmin, getTotalBlogs);

// Get total number of events
router.route('/total-events').get(protect, isAdmin, getTotalEvents);

// Get total number of payments
router.route('/total-payments').get(protect, isAdmin, getTotalPayments);

export default router;
