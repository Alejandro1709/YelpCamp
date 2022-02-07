const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');

    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
