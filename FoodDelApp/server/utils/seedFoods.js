require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const Food = require('../models/Food');

const foods = [
  {
    name: 'Pizza',
    price: 10,
    description: 'Delicious cheese pizza with fresh toppings',
    image: 'https://example.com/images/pizza.jpg',
  },
  {
    name: 'Burger',
    price: 6,
    description: 'Juicy beef burger with lettuce and tomato',
    image: 'https://example.com/images/burger.jpg',
  },
  {
    name: 'Pasta',
    price: 8,
    description: 'Creamy Alfredo pasta with chicken',
    image: 'https://example.com/images/pasta.jpg',
  },
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding foods');

    await Food.deleteMany({});
    console.log('Cleared existing foods');

    await Food.insertMany(foods);
    console.log('Seeded foods successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

seedFoods();
