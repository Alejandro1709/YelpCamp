const Campground = require('../models/Campground');

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You Must Be Signed In!');
    return res.redirect('/login');
  }
  next();
};

const isAuthor = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do this...');
      return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
  } catch (error) {}
};

module.exports = { isLoggedIn, isAuthor };
