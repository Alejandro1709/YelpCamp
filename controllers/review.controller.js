const Campground = require('../models/Campground');
const Review = require('../models/Review');

// CREATE REVIEW ENDPOINT isLoggedIn, validateReview
exports.createReview = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
};
// DELETE REVIEW
exports.deleteReview = async (req, res, next) => {
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
};
