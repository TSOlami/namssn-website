import express from 'express';

// Create an instance of an Express Router to define admin routes.
const router = express.Router();

// Import middleware for authentication and authorization.
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { 
  validateBlog, 
  validateAnnouncement, 
  validateEvent, 
  validateCategory,
  sanitizeInput 
} from '../middleware/validateMiddleware.js';

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
import { mailNotice } from '../controllers/mailer.js';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  createTest,
  updateTest,
  deleteTest,
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  reorderQuestion,
  deleteQuestion,
  getQuestionsByTest,
  extractQuestionsFromPdf,
  adminGetCourses,
  adminGetTestsByCourse,
} from '../controllers/etestAdminController.js';

// Apply sanitization to all admin routes
router.use(sanitizeInput);

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
.post(protect, isAdmin, validateCategory, createCategory)
.delete(protect, isAdmin, deleteCategory);

// Send mail to all users
router.route('/notice-mail').post(protect, isAdmin, mailNotice);

// Get, create, update and delete user blogs
router
.route('/blog')
.get(protect, isAdmin, getUserBlogs)
.post(protect, isAdmin, validateBlog, createBlog)
.put(protect, isAdmin, validateBlog, updateBlog)

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
  .post(protect, isAdmin, validateEvent, createEvent) // Create a new event

router
  .route('/events/:eventId')
  .put(protect, isAdmin, validateEvent, updateEvent) // Update an event
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

/**
 * E-Test (Past Questions) admin routes.
 */
router.get('/etest/courses', protect, isAdmin, adminGetCourses);
router.post('/etest/courses', protect, isAdmin, createCourse);
router.put('/etest/courses/:courseId', protect, isAdmin, updateCourse);
router.delete('/etest/courses/:courseId', protect, isAdmin, deleteCourse);
router.get('/etest/courses/:courseId/tests', protect, isAdmin, adminGetTestsByCourse);
router.post('/etest/courses/:courseId/tests', protect, isAdmin, createTest);
router.put('/etest/tests/:testId', protect, isAdmin, updateTest);
router.delete('/etest/tests/:testId', protect, isAdmin, deleteTest);
router.get('/etest/tests/:testId/questions', protect, isAdmin, getQuestionsByTest);
router.post('/etest/tests/:testId/questions', protect, isAdmin, addQuestion);
router.post('/etest/tests/:testId/questions/bulk', protect, isAdmin, bulkAddQuestions);
router.post('/etest/extract-questions', protect, isAdmin, extractQuestionsFromPdf);
router.put('/etest/questions/:questionId', protect, isAdmin, updateQuestion);
router.post('/etest/questions/:questionId/reorder', protect, isAdmin, reorderQuestion);
router.delete('/etest/questions/:questionId', protect, isAdmin, deleteQuestion);

export default router;
