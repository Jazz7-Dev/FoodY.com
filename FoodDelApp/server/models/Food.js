// File: server/models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('Food', FoodSchema);