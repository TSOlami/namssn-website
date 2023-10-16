import * as fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path'
import express from "express";
import multer from "multer";

// Create an instance of an Express Router to define routes.
const router = express.Router();

// Import controllers and middleware
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUserProfile,
  deleteUserProfile,
  getAllEvents,
  getAllAnnouncements,
  getUserAnnouncements,
  getAllBlogs,
  getUserBlogs,
  postUserResources,
  getUserResources,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayment,
} from "../controllers/userController.js";

import { 
  createPost,
	getAllPosts,
	getUserPosts,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  getPostComments,
  createPostComment,
  updatePostComment,
  deletePostComment,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

/**
 * Register a new user.
 *
 * @route POST /api/v1/users/
 * @access Public
 */
router.post('/', registerUser);

/**
 * Authenticate a user.
 *
 * @route POST /api/v1/users/auth
 * @access Public
 */
router.post('/auth', authUser);

/**
 * Logout a user.
 *
 * @route POST /api/v1/users/logout
 * @access Private (Requires authentication)
 */
router.post('/logout', logoutUser);

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
.get(protect, getAllAnnouncements);
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
.get(protect, getAllPosts);

// Route for getting a user post by id
router.get('/post/:userId', protect, getUserPosts);

// Route for upvoting a post
router.put('/posts/:postId/upvote', protect, upvotePost);

// Route for downvoting a post
router.put('/posts/:postId/downvote', protect, downvotePost);

// Route for creating, updating, and deleting a post
router
.route("/post")
.post(protect, createPost)
.put(protect, updatePost)
.delete(protect, deletePost);

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
  .post(protect, createPostComment);

router
  .route('/posts/:postId/comments/:commentId')
  .put(protect, updatePostComment)
  .delete(protect, deletePostComment);

/**
 * GET, POST, PUT, and DELETE user resources.
 * @route GET /api/v1/users/resources
 * @route POST /api/v1/users/resources
 * @route PUT /api/v1/users/resources/:resourceId
 * @route DELETE /api/v1/users/resources/:resourceId
 * @access Private (Requires authentication)
 */

router
  .route('/resources')
  .get(protect, getUserResources)
  .post(protect, postUserResources);

router
  .route('/resources/:resourceId')
  .put(protect, updateUserResources)
  .delete(protect, deleteUserResources);

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
router
  .route('/payments')
  .get(protect, getUserPayment)
  .post(protect,postUserPayment);

router
  .get('/resources/:filename', protect, (req, res) => {
    const filePath = path.join('C:/Users/SAHEED PC/Desktop/Portfolio/namssn-website/uploads', req.params.filename)
    res.sendFile(filePath)
  })

router
  .route('/resources')
  .post(postUserResources)
  .get((req, res) => {
    const baseURL = 'C:/Users/DH4NN/Documents/ALX/namssn-website';
    const directory = baseURL + '/uploads';
    fs.promises.readdir(directory)
    .then((files) => {
      const fileList = files.map((fileName) => {
      return (fileName);
      });
      res.json({files: fileList});
    }) .catch((err) => {
      console.log(err);
      res.status(500).send("Error")
    })
    // const __filename = fileURLToPath(import.meta.url);
    // console.log(__filename)
    // const __dirname = path.dirname(__filename);
    // const filePath = path.join('C:/Users/DH4NN/Documents/ALX/namssn-website', 'uploads/1697152427029_91qtlm_carbon_download.png');
    // res.sendFile(filePath)
  });

export default router;