const express = require('express');
const path = require('path');
const connectDB = require('./config/connectDB');
const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(2001, () => console.log('Server is live at: http://localhost:2001'));
