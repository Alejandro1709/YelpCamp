const express = require('express');
const path = require('path');
const Campground = require('./models/Campground');
const connectDB = require('./config/connectDB');
const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find();

  res.render('campgrounds/index', {
    campgrounds,
  });
});

app.listen(2001, () => console.log('Server is live at: http://localhost:2001'));
