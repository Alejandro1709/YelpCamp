const express = require('express');
const reviewController = require('../controllers/review.controller');
const { reviewSchema } = require('../schemas');
const { isLoggedIn, isReviewAuthor } = require('../middlewares/authMiddleware');
const AppError = require('../utils/AppError');
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new AppError(400, message);
  } else {
    next();
  }
};

router.post('/', isLoggedIn, validateReview, reviewController.createReview);
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
