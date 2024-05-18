// error.handler.js is used to define the error handling middleware for the API.

/**
 * Middleware function to log errors.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function logErrors(err, req, res, next) {
  console.log('logErrors');
  console.error(err);
  next(err);
}

/**
 * Error handler middleware.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.log('errorHandler');
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

module.exports = { logErrors, errorHandler };
