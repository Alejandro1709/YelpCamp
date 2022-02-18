const express = require('express');
const userController = require('../controllers/user.controller');
const passport = require('passport');
const router = express.Router();

router.get('/login', userController.getLoginPage);
router.get('/register', userController.getRegisterPage);

router.post('/register', userController.register);
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  userController.login
);

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'Goodbye!');
  res.redirect('/campgrounds');
});
module.exports = router;
