const Campground = require('../models/Campground');

// CAMPGROUNDS PAGE
exports.getCampgroundPage = async (req, res, next) => {
  try {
    const campgrounds = await Campground.find();

    res.render('campgrounds/index', {
      campgrounds,
    });
  } catch (error) {
    next(error);
  }
};
// NEW CAMPGROUND PAGE  isLoggedIn Middleware
exports.getNewPage = (req, res) => {
  res.render('campgrounds/new');
};
// NEW CAMPGROUND ENDPOINT isLoggedIn, validateCampground middleware
exports.createCampground = async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
};

// UPDATE CAMPGROUNDS PAGE isLoggedIn, isAuthor Middlewares
exports.getEditPage = async (req, res, next) => {
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
};

// UPDATE ENDPOINT ENDPOINT   isLoggedIn, isAuthor, validateCampground Middleware
exports.updateCampground = async (req, res, next) => {
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
};

// DELETE CAMPGROUND isLoggedIn, isAuthor Middleware
exports.deleteCampground = async (req, res, next) => {
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
};

// SINGLE CAMPGROUND PAGE
exports.getSingleCampground = async (req, res, next) => {
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
};
