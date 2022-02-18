const connectDB = require('../config/connectDB');
const Campground = require('../models/Campground');
const { places, descriptors } = require('../seeds/seedHelpers');
const dotenv = require('dotenv');
const cities = require('../seeds/cities');
const mongoose = require('mongoose');

dotenv.config();

connectDB();

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 1; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '620ee59cc973b4256f8446bd',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui unde voluptatem vel corrupti at magnam, labore sint hic aliquam ullam recusandae numquam ipsum magni? Dolorem non ea ducimus! Blanditiis, corporis.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
