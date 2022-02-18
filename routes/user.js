const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res, next) => {
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
});

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
});
module.exports = router;
