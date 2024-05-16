// is-auth.js middleware to check if user is logged in or not

module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/users/login');
    }
    next();
};
