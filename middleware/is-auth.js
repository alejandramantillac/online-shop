/**
 * Middleware to check if user is logged in or not.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/users/login');
    }
    next();
};
