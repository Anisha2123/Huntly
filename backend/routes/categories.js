const express = require('express');
const Category = require('../models/Category');
const Location = require('../models/Location');
const { protect, authorize } = require('../middleware/auth');

const categoryRouter = express.Router();
const locationRouter = express.Router();

// === CATEGORIES ===
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ doctorCount: -1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

categoryRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// === LOCATIONS ===
locationRouter.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ city: 1 });
    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

locationRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ success: true, location });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = { categoryRouter, locationRouter };
