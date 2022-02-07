const express = require('express');
const path = require('path');
const Campground = require('./models/Campground');
const connectDB = require('./config/connectDB');
const methodOverride = require('method-override');
const morgan = require('morgan');
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// HOME PAGE
app.get('/', (req, res) => {
  res.render('home');
});
// CAMPGROUNDS PAGE
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find();

  res.render('campgrounds/index', {
    campgrounds,
  });
});
// NEW CAMPGROUND PAGE
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
// NEW CAMPGROUND ENDPOINT
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// UPDATE CAMPGROUNDS PAGE
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);

  res.render('campgrounds/edit', {
    campground,
  });
});

// UPDATE ENDPOINT ENDPOINT
app.put('/campgrounds/:id', async (req, res) => {
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
  res.redirect(`/campgrounds/${campground._id}`);
});

// DELETE CAMPGROUND
app.delete('/campgrounds/:id', async (req, res) => {
  await Campground.findByIdAndRemove(req.params.id);
  res.redirect('/campgrounds');
});

// SINGLE CAMPGROUND PAGE
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);

  res.render('campgrounds/show', {
    campground,
  });
});

app.listen(2001, () => console.log('Server is live at: http://localhost:2001'));
