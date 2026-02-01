import express from "express";

// Create an instance of an Express Router to define routes.
const router = express.Router();

// Import controllers and middleware
import {
  authUser,
  registerUser,
  verifyAccount,
  generateOTP,
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
  getSpecifiedLevelResources,
  getFile,
  deleteUserResources,
  postUserPayment,
  getUserPayments,
  getPaymentOptions,
  verifyOTP,
  resendOTP,
  verifyUserPayment,
  getSearchResults,
  checkEmailExistence,
  checkStudentEmailExistence,
} from "../controllers/userController.js";
import {
  getCourses,
  getTestsByCourse,
  getTestById,
  submitAttempt,
  getAttemptById,
  getUserAttempts,
} from "../controllers/etestController.js";

import { 
  createPost,
	getPosts,
  getFeed,
  getPostById,
	getUserPosts,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  getPostComments,
  createPostComment,
  updatePostComment,
  deletePostComment,
  upvoteComment,
  downvoteComment,
  getNotifications,
  markNotificationsAsSeen,
  deleteNotification,
  clearNotifications,
} from "../controllers/postController.js";
import { registerMail, contactUs } from "../controllers/mailer.js";
import { protect, verifyUser, otpStatusCheck } from "../middleware/authMiddleware.js";
import { 
  validateRegistration, 
  validateLogin, 
  validatePost, 
  validateComment,
  sanitizeInput 
} from "../middleware/validateMiddleware.js";

// Apply sanitization to all routes
router.use(sanitizeInput);


/**
 * Health check route
 * 
 * @route GET /api/v1/users/health
 * @access Public
*/
router.get("/health", (req, res) => {
  res.send("API is running");
});


// Route for sending a welcome email
router.route('/register-mail').post(registerMail);
/**
 * Register a new user.
 *
 * @route POST /api/v1/users/
 * @access Public
 */
router.post('/', validateRegistration, registerUser);

/**
 * Authenticate a user.
 *
 * @route POST /api/v1/users/auth
 * @access Public
 */
router.post('/auth', validateLogin, authUser);

/**
 * Verify a user account.
 * 
 * @route POST /api/v1/users/verify-account
 * @access Private
 */
router.route('/verify-account').post(verifyAccount);

/**
 * Check if email exists
 * 
 * @route POST /api/v1/users/check-email
 * @access Public
 * @param {string} email - The email of the user
 * @returns {boolean} exists - Whether the email exists or not
 * @returns {string} message - The message to be displayed
 */
router.route('/check-email').post(checkEmailExistence);

/**
 * Check if student email exists
 * 
 * @route POST /api/v1/users/check-student-email
 * @access Public
 * @param {string} email - The email of the user
 * @returns {boolean} exists - Whether the email exists or not
 * @returns {string} message - The message to be displayed
 */
router.route('/check-student-email').post(checkStudentEmailExistence);

/**
 * Generate OTP
 * 
 * @route GET /api/v1/users/generate-otp
 * @access Public
 */
router.route('/generate-otp/:username').get(verifyUser, generateOTP);

/**
 * Resend OTP
 * 
 * @route GET /api/v1/users/resend-otp
 * @access Public
 * @param {string} username - The username of the user to resend OTP to
 */
router.route('/resend-otp/:username').get(verifyUser, resendOTP);

/**
 * Verify  generated OTP
 * 
 * @route  POST /api/v1/users/otp
 * @access Public
 */
router.route('/verify-otp').post(verifyUser, verifyOTP);

/**
 * Reset Password
 * 
 * PUT /api/v1/users/reset-password
 * @access Public
 */
router.route('/reset-password').put(verifyUser, otpStatusCheck, resetPassword);

/**
 * Logout a user.
 *
 * @route POST /api/v1/users/logout
 * @access Private (Requires authentication)
 */
router.post('/logout', logoutUser);

/**
 * Contact us
 * 
 * @route POST /api/v1/users/contact-us
 * @access Public
 * @param {string} name - The name of the user
 * @param {string} email - The email of the user
 * @param {string} message - The message of the user
 */
router.post('/contact-us', contactUs);

/**
 * Get, update, and delete a user profile.
 *
 * @route GET /api/v1/users/profile
 * @route PUT /api/v1/users/profile
 * @route DELETE /api/v1/users/profile
 * @access Private (Requires authentication)
 */
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

// Route for getting a user by id
router.route('/profile/:userId').get(protect, getUserById);

// Route for getting a user by username
router.route('/user').get(getUserByUsername);

/**
 * Get Events
 * @route GET /api/v1/users/events
 * @access Public (Does not require authentication)
 */
router.get('/events', getAllEvents);

/**
 * Get Announcements
 * @route GET /api/v1/users/announcements
 * @access Private 
 */
router.route('/announcements')
.get(getAllAnnouncements);

// Route for getting all announcements by user
router
.route('/announcement')
.get(protect, getUserAnnouncements);

/**
 * Get, create, update, and delete user posts.
 * 
 * @route GET /api/v1/users/posts
 * @route GET /api/v1/users/posts/:postId
 * @route POST /api/v1/users/posts
 * @route PUT /api/v1/users/posts/:postId
 * @route DELETE /api/v1/users/posts/:postId
 * @access Private (Requires authentication)
 */

// Route for getting all posts
router
.route("/posts")
.get(getPosts);

// Combined feed (posts + unread notifications count) - reduces round trips
router.get("/feed", protect, getFeed);

// Route for getting a post by id
router.get('/posts/:postId', protect, getPostById);

// Route for getting a user post by id
router.get('/post/:userId', protect, getUserPosts);

// Route for upvoting a post
router.put('/posts/:postId/upvote', protect, upvotePost);

// Route for downvoting a post
router.put('/posts/:postId/downvote', protect, downvotePost);

// Route for creating, updating, and deleting a post
router
.route("/post")
.post(protect, validatePost, createPost)
.put(protect, validatePost, updatePost)
.delete(protect, deletePost);

// Route for getting and deleting all notifications
router
.route('/notifications')
.get(protect, getNotifications)
.delete(protect, clearNotifications);

// Route for marking notifications as seen
router
.route('/notifications/seen')
.put(protect, markNotificationsAsSeen);

// Route for deleting a notification
router
.route('/notifications/:notificationId')
.delete(protect, deleteNotification);


/**
 * Get, create, update and delete user post comments.
 * 
 * @route GET /api/v1/users/posts/:postId/comments
 * @route POST /api/v1/users/posts/:postId/comments
 * @route PUT /api/v1/users/posts/:postId/comments/:commentId
 * @route DELETE /api/v1/users/posts/:postId/comments/:commentId
 * @access Private (Requires authentication)
 */
 router
  .route('/posts/:postId/comments')
  .get(protect, getPostComments)
  .post(protect, validateComment, createPostComment);

router
  .route('/posts/:postId/comments/:commentId')
  .put(protect, validateComment, updatePostComment)
  .delete(protect, deletePostComment);

// Route for upvoting a post comment
router.put('/posts/:postId/comments/:commentId/upvote', protect, upvoteComment);

// Route for downvoting a post comment
router.put('/posts/:postId/comments/:commentId/downvote', protect, downvoteComment);

/**
 * GET, POST, PUT, and DELETE user resources.
 * @route GET /api/v1/users/resources
 * @route POST /api/v1/users/resources
 * @route PUT /api/v1/users/resources/:resourceId
 * @route DELETE /api/v1/users/resources/:resourceId
 * @access Private (Requires authentication)
 */

// router
//   .route('/resources')
//   .get(protect, getUserResources)
//   .post(protect, postUserResources);

// router
//   .route('/resources/:resourceId')
//   .put(protect, updateUserResources)
//   .delete(protect, deleteUserResources);

/**
 * Get all blogs and blogs by user.
 * @route GET /api/v1/users/blogs
 * @access Public (Does not require authentication)
 * @route GET /api/v1/users/blog 
 * @access Private (Requires authentication)
 */
// Route for getting all blogs
router.get('/blogs', getAllBlogs);
// Route for getting all blogs by user
router
.route('/blog')
.get(protect, getUserBlogs)

/**
 * Get and create user payment history.
 *
 * @route GET /api/v1/users/payments
 * @route POST /api/v1/users/payments
 * @access Private (Requires authentication)
 */
router.get('/payments/:userId', protect, getUserPayments);
router.post('/payments/verify', protect, verifyUserPayment);
router
  .route('/payments')
  .get(protect, getPaymentOptions)
  // .get(protect, getUserPayment)
  .post(protect,postUserPayment);


router
  .route('/resources/:filename')
  .get(getFile)
  .delete(deleteUserResources)

router
  .route('/resources')
  .post(postUserResources)
  .get(getUserResources);

router.get('/search', getSearchResults);

router.get('/etest/courses', getCourses);
router.get('/etest/courses/:courseId/tests', getTestsByCourse);
router.get('/etest/tests/:testId', getTestById);
router.post('/etest/tests/:testId/attempt', protect, submitAttempt);
router.get('/etest/attempts', protect, getUserAttempts);
router.get('/etest/attempts/:attemptId', protect, getAttemptById);

router.get('/:level/resources', getSpecifiedLevelResources);

export default router;