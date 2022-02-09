const express = require('express');
const path = require('path');
const Campground = require('./models/Campground');
const Review = require('./models/Review');
const connectDB = require('./config/connectDB');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const { campgroundSchema, reviewSchema } = require('./schemas');
const AppError = require('./utils/AppError');
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new AppError(400, message);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(',');
    throw new AppError(400, message);
  } else {
    next();
  }
};

// HOME PAGE
app.get('/', (req, res) => {
  res.render('home');
});
// CAMPGROUNDS PAGE
app.get('/campgrounds', async (req, res, next) => {
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
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
// NEW CAMPGROUND ENDPOINT
app.post('/campgrounds', validateCampground, async (req, res, next) => {
  try {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// UPDATE CAMPGROUNDS PAGE
app.get('/campgrounds/:id/edit', async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    res.render('campgrounds/edit', {
      campground,
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE ENDPOINT ENDPOINT
app.put('/campgrounds/:id', validateCampground, async (req, res, next) => {
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

    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    next(error);
  }
});

// DELETE CAMPGROUND
app.delete('/campgrounds/:id', async (req, res, next) => {
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
app.get('/campgrounds/:id', async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    );

    if (!campground) {
      throw next(new AppError(404, 'This Campground does not exists!'));
    }

    res.render('campgrounds/show', {
      campground,
    });
  } catch (error) {
    next(error);
  }
});

// CREATE REVIEW ENDPOINT
app.post('/campgrounds/:id/reviews', validateReview, async (req, res, next) => {
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
app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res, next) => {
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

// Unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(404, 'Page Not Found!'));
});

// ERROR
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';

  res.status(status).render('error', {
    err,
  });
});

app.listen(2001, () => console.log('Server is live at: http://localhost:2001'));
