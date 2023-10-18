// Import the 'jsonwebtoken' library for working with JSON Web Tokens (JWTs).
import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) containing the user's ID and sets it as a cookie in the response.
 *
 * @param {Object} res - Express response object.
 * @param {string} userId - User's unique identifier.
 */
const generateToken = (res, userId) => {
  // Generate a JWT with the user's ID, using the secret from environment variables
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '3d' // Token expires in 3 days
  });

  // Set the JWT as a cookie in the response
  res.cookie('jwt', token, {
    httpOnly: true, // Cookie is accessible only via HTTP (not JavaScript)
    secure: process.env.NODE_ENV !== 'development', // Enable secure cookie in production
    sameSite: 'strict', // Restrict cookie to same-site requests
    maxAge: 3 * 24 * 60 * 60 * 1000 // Maximum age of the cookie (3 days in milliseconds)
  });
};

export default generateToken;
