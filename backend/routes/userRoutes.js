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
  updateUserProfile,
  deleteUserProfile,
  createPost,
	getAllPosts,
	getUserPosts,
  updatePost,
  deletePost,
  getAllBlogs,
  postUserResources,
  getUserResources,
  updateUserResources,
  deleteUserResources,
  postUserPayment,
  getUserPayment,
} from "../controllers/userController.js";

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

// Route for getting all blogs
router.get('/blogs', getAllBlogs);

// Route for getting all posts
router
.route("/posts")
.get(protect, getAllPosts);


router
.route("/post")
.get(protect, getUserPosts)
.post(protect, createPost)
.put(protect, updatePost)
.delete(protect, deletePost);

// Get, create, update and delete user posts
router
.route('/blog')
.get(protect, getAllBlogs)

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
  .get('/resources/:filename', (req, res) => {
    const filePath = path.join('C:/Users/DH4NN/Documents/ALX/namssn-website/uploads', req.params.filename)
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
      return path.join(directory, fileName);
      });
      res.json({files: {}});
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