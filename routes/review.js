const express = require('express');
const Campground = require('../models/Campground');
const Review = require('../models/Review');
const AppError = require('../utils/AppError');
const { reviewSchema } = require('../schemas');
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

// CREATE REVIEW ENDPOINT
router.post('/', validateReview, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    const review = new Review(req.body.review);

    campground.reviews.push(review);

    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});
// DELETE REVIEW
router.delete('/:reviewId', async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!!'));
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.redirect(`/campgrounds/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
