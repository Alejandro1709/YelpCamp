const User = require('../models/User');

exports.getLoginPage = (req, res) => {
  res.render('users/login');
};

exports.getRegisterPage = (req, res) => {
  res.render('users/register');
};

exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome To YelpCamp!');
      res.redirect('/campgrounds');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

exports.logout = (req, res) => {
  req.logOut();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
};
