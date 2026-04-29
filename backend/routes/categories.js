const express  = require('express');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Doctor   = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

const categoryRouter = express.Router();
const locationRouter = express.Router();

// GET /api/categories
// Returns unique specializations from actual Doctor documents
// Handles both: specialization (string) and specializations (ObjectId array)
categoryRouter.get('/', async (req, res) => {
  try {
    // Get all distinct specialization strings from doctors
    const stringSpecs = await Doctor.distinct('specialization', { isActive: true });

    // Build result — one entry per unique specialization name
    const ICONS = {
      'Dermatologist':    '🧴',
      'Cardiologist':     '❤️',
      'Dentist':          '🦷',
      'Orthopedist':      '🦴',
      'Neurologist':      '🧠',
      'Pediatrician':     '👶',
      'Ophthalmologist':  '👁️',
      'Gynecologist':     '🌸',
      'Psychiatrist':     '🧘',
      'ENT Specialist':   '👂',
      'General Physician':'🩺',
      'Urologist':        '💊',
    }

    const result = await Promise.all(
      stringSpecs
        .filter(s => s && s.trim())
        .map(async (name) => {
          const count = await Doctor.countDocuments({
            isActive: true,
            $or: [
              { specialization: new RegExp(`^${name}$`, 'i') },
            ]
          })
          const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          return {
            _id:        slug,   // use slug as _id for frontend keying
            name,
            slug,
            icon:       ICONS[name] || '🩺',
            doctorCount: count,
            isActive:   true,
          }
        })
    )

    const filtered = result
      .filter(c => c.doctorCount > 0)
      .sort((a, b) => b.doctorCount - a.doctorCount)

    res.json({ success: true, categories: filtered })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

categoryRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json({ success: true, category })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// === LOCATIONS ===
locationRouter.get('/', async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ city: 1 })
    res.json({ success: true, locations })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

locationRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const location = await Location.create(req.body)
    res.status(201).json({ success: true, location })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = { categoryRouter, locationRouter }