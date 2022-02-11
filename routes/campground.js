const express = require('express');
const Campground = require('../models/Campground');
const { campgroundSchema } = require('../schemas');
const AppError = require('../utils/AppError');
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
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});
// NEW CAMPGROUND ENDPOINT
router.post('/', validateCampground, async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// UPDATE CAMPGROUNDS PAGE
router.get('/:id/edit', async (req, res, next) => {
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
router.put('/:id', validateCampground, async (req, res, next) => {
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
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// DELETE CAMPGROUND
router.delete('/:id', async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndDelete(req.params.id);

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    res.redirect('/campgrounds');
  } catch (error) {
    next(error);
  }
});

// SINGLE CAMPGROUND PAGE
router.get('/:id', async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    );

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
