import jwt from 'jsonwebtoken'; // Import the 'jsonwebtoken' library for working with JSON Web Tokens (JWTs).
import asyncHandler from 'express-async-handler'; // Import the 'express-async-handler' library for handling asynchronous errors.
import User from '../models/userModel.js'; // Import the User model for querying user data from the database.

/**
 * Middleware to protect routes by verifying JWT tokens.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract the JWT token from the request cookies.
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify and decode the JWT token using the secret key.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user associated with the decoded token, excluding the password field.
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not Authorized, Invalid Token');
    }
  } else {
    res.status(401);
    throw new Error('Not Authorized, no token');
  }
});

/**
 * Middleware to check if the user is an admin.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next(); // User is an admin, continue with the request
    } else {
      res.status(403).json({ message: 'Access denied: Admin privileges required.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to check admin privileges.' });
  }
});

export { protect, isAdmin };
