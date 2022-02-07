const connectDB = require('../config/connectDB');
const Campground = require('../models/Campground');
const { places, descriptors } = require('../seeds/seedHelpers');
const cities = require('../seeds/cities');
const mongoose = require('mongoose');

connectDB();

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 1; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
