const express = require('express');
const path = require('path');
const connectDB = require('./config/connectDB');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const AppError = require('./utils/AppError');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// HOME PAGE
app.get('/', (req, res) => {
  res.render('home');
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

const PORT = process.env.PORT || 2001;

app.listen(2001, () =>
  console.log(`Server is live at: http://localhost:${PORT}`)
);
