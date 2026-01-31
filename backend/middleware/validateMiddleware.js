/**
 * Input validation middleware for the NAMSSN API
 * Provides request body validation and sanitization
 */

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} str - Input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format (alphanumeric, underscores, 3-30 chars)
 * @param {string} username - Username to validate
 * @returns {boolean} - Whether username is valid
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength (min 6 chars)
 * @param {string} password - Password to validate
 * @returns {boolean} - Whether password meets requirements
 */
const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Middleware to validate user registration input
 */
export const validateRegistration = (req, res, next) => {
  const { name, username, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!username || !isValidUsername(username)) {
    errors.push('Username must be 3-30 characters, alphanumeric and underscores only');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || !isValidPassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.username = sanitizeString(username);
  req.body.email = sanitizeString(email);

  next();
};

/**
 * Middleware to validate user login input
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  next();
};

/**
 * Middleware to validate post creation input
 */
export const validatePost = (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: 'Post text is required' });
  }

  if (text.length > 5000) {
    return res.status(400).json({ message: 'Post text must be less than 5000 characters' });
  }

  // Sanitize text
  req.body.text = sanitizeString(text);

  next();
};

/**
 * Middleware to validate blog creation input
 */
export const validateBlog = (req, res, next) => {
  const { title, content, coverImage, author } = req.body;
  const errors = [];

  if (!title || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (!content || content.trim().length < 50) {
    errors.push('Content must be at least 50 characters long');
  }

  if (!coverImage || coverImage.trim().length === 0) {
    errors.push('Cover image is required');
  }

  if (!author || author.trim().length < 2) {
    errors.push('Author name must be at least 2 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize inputs
  req.body.title = sanitizeString(title);
  req.body.author = sanitizeString(author);

  next();
};

/**
 * Middleware to validate announcement input
 */
export const validateAnnouncement = (req, res, next) => {
  const { text, level } = req.body;
  const validLevels = ['100', '200', '300', '400', '500', 'Non-Student'];
  const errors = [];

  if (!text || text.trim().length < 10) {
    errors.push('Announcement text must be at least 10 characters long');
  }

  if (!level || !validLevels.includes(level)) {
    errors.push('Please select a valid level');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize text
  req.body.text = sanitizeString(text);

  next();
};

/**
 * Middleware to validate event input
 */
export const validateEvent = (req, res, next) => {
  const { title, image } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Event title must be at least 3 characters long');
  }

  if (!image || image.trim().length === 0) {
    errors.push('Event image is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize inputs
  req.body.title = sanitizeString(title);
  if (req.body.location) {
    req.body.location = sanitizeString(req.body.location);
  }

  next();
};

/**
 * Middleware to validate comment input
 */
export const validateComment = (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  if (text.length > 2000) {
    return res.status(400).json({ message: 'Comment must be less than 2000 characters' });
  }

  // Sanitize text
  req.body.text = sanitizeString(text);

  next();
};

/**
 * Middleware to validate MongoDB ObjectId
 */
export const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName] || req.body[paramName];
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!id || !objectIdRegex.test(id)) {
    return res.status(400).json({ message: `Invalid ${paramName} format` });
  }

  next();
};

/**
 * Middleware to validate payment category input
 */
export const validateCategory = (req, res, next) => {
  const { name, session, amount } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Category name must be at least 3 characters long');
  }

  if (!session || session.trim().length === 0) {
    errors.push('Session is required');
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  // Sanitize inputs
  req.body.name = sanitizeString(name);
  req.body.session = sanitizeString(session);
  req.body.amount = Number(amount);

  next();
};

/**
 * Generic sanitization middleware for all requests
 */
export const sanitizeInput = (req, res, next) => {
  // Recursively sanitize all string values in the request body
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
};
