// File: server/routes/foods.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (error) {
    console.error('Failed to fetch foods:', error);
    res.status(500).json({ message: 'Failed to fetch foods' });
  }
});

module.exports = router;
