import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }
  if (!token) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not Authorized, Invalid Token');
      }
      if (req.user.isBlocked) {
        res.status(403).json({ message: 'Your account has been blocked. Please contact an administrator.' });
        return;
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not Authorized, Invalid Token');
    }
  } else {
    res.status(401);
    throw new Error('Not Authorized, please login again');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
 try {
   if (req.user && req.user.role === 'admin') {
     return next();
   } else {
     res.status(403).json({ message: 'Access denied: Admin privileges required.' });
   }
 } catch (error) {
   res.status(500).json({ message: 'Server error: Unable to check admin privileges.' });
 }
});

const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    let username;
    if (req.method === "GET") {
      username = req.params.username || req.query.username;
    } else if (req.method === "POST" || req.method === "PUT") {
      username = req.body.username;
    } else {
      return res.status(400).json({ message: "Unsupported request method" });
    }
    if (!username) {
      return res.status(400).json({ message: "Missing username in the request" });
    }
    let userExists = await User.findOne({ username });

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to verify user.' });
  }
});


/**
 *  Middleware to check otp status
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
const otpStatusCheck = asyncHandler(async (req, res, next) => {
  try {
    // Get the username from the request body
    const { username } = req.body;

    // Fetch the user
    const user = await User.findOne({ username });

    // Check if the user has generated an OTP
    if (user.otpGenerated && user.otpVerified) {
      next();
    } else {
      // Return an error response if OTP is not generated or verified
      return res.status(400).json({ message: "OTP not generated or verified" });
    }
  } catch (error) {
    // Handle any errors that occur during OTP status check
    console.error(error);
    res.status(500).json({ message: 'Server error: Unable to check OTP status.' });
  }
});


export { protect, isAdmin, verifyUser, otpStatusCheck };
