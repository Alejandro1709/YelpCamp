const express = require('express');
const campgroundController = require('../controllers/campground.controller');
const { campgroundSchema } = require('../schemas');
const AppError = require('../utils/AppError');
const { isLoggedIn, isAuthor } = require('../middlewares/authMiddleware');
const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new AppError(400, message);
  } else {
    next();
  }
};

router
  .route('/')
  .get(campgroundController.getCampgroundPage)
  .post(isLoggedIn, validateCampground, campgroundController.createCampground);

router
  .route('/:id')
  .get(campgroundController.getSingleCampground)
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    campgroundController.updateCampground
  )
  .delete(isLoggedIn, isAuthor, campgroundController.deleteCampground);

router.get('/new', isLoggedIn, campgroundController.getNewPage);

router.get('/:id/edit', isLoggedIn, isAuthor, campgroundController.getEditPage);

module.exports = router;
