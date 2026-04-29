const express = require('express');
const Doctor  = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors
// Full-featured search + filter + sort + pagination
// New query params: conditions, procedures, consultationMode, rank
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      search,
      city, area,
      specialization,
      conditions,       // comma-separated condition names
      procedures,       // comma-separated procedure names
      consultationMode, // "Clinic" | "Online" | "Both"
      minFee, maxFee,
      minRating,
      availableOnline,
      availableToday,
      isFeatured,
      sortBy,
      page  = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // ── Full-text search ────────────────────────────────────────────
    if (search) {
      query.$text = { $search: search };
    }

    // ── Location ────────────────────────────────────────────────────
    if (city) query.primaryCity  = new RegExp(city, 'i');
    if (area) query.primaryArea  = new RegExp(area, 'i');

    // ── Specialization filter ───────────────────────────────────────
    // doctor.specialization is a plain string e.g. "Dermatologist"
    // slug from frontend is e.g. "dermatologist" — convert back to name
    if (specialization) {
      const nameFromSlug = specialization.replace(/-/g, ' ')
      query.specialization = new RegExp(nameFromSlug, 'i')
    }

    // ── Conditions treated (ANY match) ─────────────────────────────
    if (conditions) {
      const list = conditions.split(',').map(c => c.trim()).filter(Boolean);
      if (list.length) {
        query.conditionsTreated = { $in: list.map(c => new RegExp(c, 'i')) };
      }
    }

    // ── Procedures offered (ANY match) ──────────────────────────────
    if (procedures) {
      const list = procedures.split(',').map(p => p.trim()).filter(Boolean);
      if (list.length) {
        query.proceduresOffered = { $in: list.map(p => new RegExp(p, 'i')) };
      }
    }

    // ── Consultation mode ───────────────────────────────────────────
    if (consultationMode) {
      if (consultationMode === 'Online') {
        // Online-only OR both
        query.consultationMode = { $in: ['Online', 'Both'] };
      } else {
        query.consultationMode = consultationMode;
      }
    }

    // ── Fee range ───────────────────────────────────────────────────
    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
    }

    // ── Rating ──────────────────────────────────────────────────────
    if (minRating) query.averageRating = { $gte: Number(minRating) };

    // ── Boolean availability ────────────────────────────────────────
    if (availableOnline === 'true') query.availableOnline = true;
    if (availableToday  === 'true') query.availableToday  = true;
    if (isFeatured      === 'true') query.isFeatured      = true;

    // ── Sort ─────────────────────────────────────────────────────────
    let sort = { isFeatured: -1, rank: 1, averageRating: -1 };
    switch (sortBy) {
      case 'rating':     sort = { averageRating: -1 };    break;
      case 'fee_asc':    sort = { consultationFee: 1 };   break;
      case 'fee_desc':   sort = { consultationFee: -1 };  break;
      case 'experience': sort = { experience: -1 };       break;
      case 'reviews':    sort = { totalReviews: -1 };     break;
      case 'rank':       sort = { rank: 1 };              break;
      case 'newest':     sort = { createdAt: -1 };        break;
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Doctor.countDocuments(query);

    const doctors = await Doctor.find(query)
      .populate('specializations', 'name slug icon')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      count: doctors.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      doctors
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/featured
// ─────────────────────────────────────────────────────────────────────────────
router.get('/featured', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isFeatured: true, isActive: true })
      .populate('specializations', 'name slug icon')
      .sort({ rank: 1, averageRating: -1 })
      .limit(8)
      .lean();
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/top-rated
// ─────────────────────────────────────────────────────────────────────────────
router.get('/top-rated', async (req, res) => {
  try {
    const { city } = req.query;
    const query = { isActive: true, totalReviews: { $gte: 1 } };
    if (city) query.primaryCity = new RegExp(city, 'i');

    const doctors = await Doctor.find(query)
      .populate('specializations', 'name slug icon')
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(10)
      .lean();
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/autocomplete?q=acne
// Returns distinct condition/procedure/name suggestions for search
// ─────────────────────────────────────────────────────────────────────────────
router.get('/autocomplete', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

    const re = new RegExp(q, 'i');
    const [names, conditions, procedures] = await Promise.all([
      Doctor.distinct('name',               { name: re, isActive: true }),
      Doctor.distinct('conditionsTreated',  { conditionsTreated: re, isActive: true }),
      Doctor.distinct('proceduresOffered',  { proceduresOffered: re, isActive: true }),
    ]);

    const suggestions = [
      ...names.slice(0, 3).map(v => ({ type: 'doctor',    value: v })),
      ...conditions.slice(0, 4).map(v => ({ type: 'condition', value: v })),
      ...procedures.slice(0, 3).map(v => ({ type: 'procedure', value: v })),
    ];
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/filters/meta   — distinct values for filter UI
// ─────────────────────────────────────────────────────────────────────────────
router.get('/filters/meta', async (req, res) => {
  try {
    const { city } = req.query;
    const match = { isActive: true };
    if (city) match.primaryCity = new RegExp(city, 'i');

    const [conditions, procedures, areas, equipment] = await Promise.all([
      Doctor.distinct('conditionsTreated', match),
      Doctor.distinct('proceduresOffered', match),
      Doctor.distinct('primaryArea',       match),
      Doctor.distinct('equipment',         match),
    ]);

    res.json({
      success: true,
      conditions: conditions.filter(Boolean).sort(),
      procedures: procedures.filter(Boolean).sort(),
      areas:      areas.filter(Boolean).sort(),
      equipment:  equipment.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/:slug
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ slug: req.params.slug, isActive: true })
      .populate('specializations', 'name slug icon description');

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/doctors  (Admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Auto-set availableOnline from consultationMode if not provided
    const body = { ...req.body };
    if (body.consultationMode && body.availableOnline === undefined) {
      body.availableOnline = ['Online', 'Both'].includes(body.consultationMode);
    }
    const doctor = await Doctor.create(body);
    res.status(201).json({ success: true, doctor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/doctors/:id  (Admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.consultationMode && body.availableOnline === undefined) {
      body.availableOnline = ['Online', 'Both'].includes(body.consultationMode);
    }
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/doctors/:id  (Admin only – soft delete)
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Doctor listing deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;