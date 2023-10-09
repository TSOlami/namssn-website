/**
 * Middleware to handle 404 Not Found errors.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
const notFound = (req, res, next) => {
	const error = new Error(`Not found - ${req.originalUrl}`);
	res.status(404);
	next(error);
  }
  
  /**
   * Middleware to handle errors and send appropriate responses.
   *
   * @param {Object} err - Error object.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next function.
   */
  const errorHandler = (err, req, res, next) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;
  
	// Handle CastError specifically for ObjectId errors.
	if (err.name === 'CastError' && err.kind === 'ObjectId') {
	  statusCode = 404;
	  message = 'Resource not found';
	}
  
	// Send an error response with the appropriate status code and message.
	res.status(statusCode).json({
	  message,
	  stack: process.env.NODE_ENV === 'production' ? null : err.stack
	});
  }
  
  export { notFound, errorHandler };
  