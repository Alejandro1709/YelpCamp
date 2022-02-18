const express = require('express');
const Campground = require('../models/Campground');
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

// CAMPGROUNDS PAGE
router.get('/', async (req, res, next) => {
  try {
    const campgrounds = await Campground.find();

    res.render('campgrounds/index', {
      campgrounds,
    });
  } catch (error) {
    next(error);
  }
});
// NEW CAMPGROUND PAGE
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
// NEW CAMPGROUND ENDPOINT
router.post('/', isLoggedIn, validateCampground, async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// UPDATE CAMPGROUNDS PAGE
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash('error', 'This Campground does not exists!');
      return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', {
      campground,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE ENDPOINT ENDPOINT
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  async (req, res, next) => {
    try {
      const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body.campground,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!campground) {
        req.flash('error', 'This Campground does not exists!');
        return res.redirect('/campgrounds');
      }

      req.flash('success', 'Successfully updated campground!');
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE CAMPGROUND
router.delete('/:id', isLoggedIn, isAuthor, async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndDelete(req.params.id);

    if (!campground) {
      req.flash('error', 'This Campground does not exists!');
      return res.redirect('/campgrounds');
    }

    res.redirect('/campgrounds');
  } catch (error) {
    next(error);
  }
});

// SINGLE CAMPGROUND PAGE
router.get('/:id', async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author');

    if (!campground) {
      req.flash('error', 'This Campground does not exists!');
      return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', {
      campground,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
