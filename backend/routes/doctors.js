const express = require('express');
const Doctor  = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Logger helpers
// ─────────────────────────────────────────────────────────────────────────────
const ts   = () => new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
const L    = (tag, ...a) => console.log( `\x1b[35m[${ts()}][${tag}]\x1b[0m`, ...a);
const LW   = (tag, ...a) => console.warn(`\x1b[33m[${ts()}][${tag}] ⚠\x1b[0m`, ...a);
const LE   = (tag, ...a) => console.error(`\x1b[31m[${ts()}][${tag}] ✗\x1b[0m`, ...a);
const LINE = ()           => console.log('\x1b[35m' + '─'.repeat(60) + '\x1b[0m');

// ─────────────────────────────────────────────────────────────────────────────
// normalize(doc) — ensures consistent fields regardless of DB layout
// ─────────────────────────────────────────────────────────────────────────────
function normalize(doc) {
  const d = doc.toObject ? doc.toObject() : { ...doc };

  // averageRating / totalReviews — flat fields preferred, fall back to nested rating
  if (!d.averageRating && d.rating?.value)  d.averageRating = d.rating.value;
  if (!d.totalReviews  && d.rating?.count)  d.totalReviews  = d.rating.count;
  if (typeof d.averageRating === 'string')  d.averageRating = parseFloat(d.averageRating) || 0;
  if (typeof d.totalReviews  === 'string')  d.totalReviews  = parseInt(d.totalReviews,10) || 0;

  // consultationFee — root level first, then clinic[0]
  if (d.consultationFee == null && d.clinics?.length) {
    d.consultationFee = d.clinics[0].consultationFee ?? d.clinics[0].fees ?? null;
  }

  // phone
  if (!d.phone) d.phone = d.clinics?.[0]?.phone || d.contact?.phone || null;

  // primaryArea
  if (!d.primaryArea && d.clinics?.length) d.primaryArea = d.clinics[0].area || null;

  // specializations — add slug+icon if missing
  if (d.specializations?.length) {
    d.specializations = d.specializations.map(s => ({
      ...s,
      slug: s.slug || (s.name || '').toLowerCase().replace(/\s+/g, '-'),
      icon: s.icon || '🩺',
    }));
  }

  // availableOnline derived from consultationMode
  if (d.availableOnline == null) {
    d.availableOnline = ['Online', 'Both'].includes(d.consultationMode);
  }

  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  LINE();
  L('LIST', 'Incoming GET /api/doctors');
  L('LIST', 'Raw query:', JSON.stringify(req.query));

  try {
    const {
      search, city, area, specialization,
      conditions, procedures, consultationMode,
      minFee, maxFee, minRating,
      availableOnline, availableToday, isFeatured,
      sortBy, page = 1, limit = 12,
    } = req.query;

    const query      = { isActive: true };
    const andClauses = [];

    // ── Search ─────────────────────────────────────────────
    if (search?.trim()) {
      const re = new RegExp(search.trim(), 'i');
      andClauses.push({ $or: [
        { name: re }, { qualificationText: re },
        { conditionsTreated: re }, { proceduresOffered: re },
        { 'specializations.name': re }, { 'clinics.name': re }, { primaryArea: re },
      ]});
      L('LIST', `  search = "${search.trim()}"`);
    }

    // ── Location ───────────────────────────────────────────
    if (city)  { query.primaryCity = new RegExp(city.trim(),  'i'); L('LIST', `  city   = "${city.trim()}"`);  }
    if (area)  { query.primaryArea = new RegExp(area.trim(),  'i'); L('LIST', `  area   = "${area.trim()}"`);  }

    // ── Specialization ─────────────────────────────────────
    if (specialization?.trim()) {
      const term = specialization.trim();
      const nameFromSlug = term.replace(/-/g, ' ');
      andClauses.push({ $or: [
        { 'specializations.slug': new RegExp(term,         'i') },
        { 'specializations.name': new RegExp(nameFromSlug, 'i') },
      ]});
      L('LIST', `  specialization = slug:"${term}" OR name:"${nameFromSlug}"`);
    }

    // ── Conditions ─────────────────────────────────────────
    if (conditions) {
      const list = conditions.split(',').map(c => c.trim()).filter(Boolean);
      if (list.length) {
        query.conditionsTreated = { $in: list.map(c => new RegExp(c, 'i')) };
        L('LIST', `  conditions = [${list.join(', ')}]`);
      }
    }

    // ── Procedures ─────────────────────────────────────────
    if (procedures) {
      const list = procedures.split(',').map(p => p.trim()).filter(Boolean);
      if (list.length) {
        query.proceduresOffered = { $in: list.map(p => new RegExp(p, 'i')) };
        L('LIST', `  procedures = [${list.join(', ')}]`);
      }
    }

    // ── Consultation mode ──────────────────────────────────
    if (consultationMode) {
      query.consultationMode = consultationMode === 'Online'
        ? { $in: ['Online', 'Both'] } : consultationMode;
      L('LIST', `  consultationMode = "${consultationMode}"`);
    }

    // ── Fee ────────────────────────────────────────────────
    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
      L('LIST', `  fee = min:${minFee || 'any'} max:${maxFee || 'any'}`);
    }

    // ── Rating ─────────────────────────────────────────────
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
      L('LIST', `  minRating = ${minRating}`);
    }

    // ── Booleans ───────────────────────────────────────────
    if (availableOnline === 'true') { query.availableOnline = true; L('LIST', '  availableOnline = true'); }
    if (availableToday  === 'true') { query.availableToday  = true; L('LIST', '  availableToday  = true'); }
    if (isFeatured      === 'true') { query.isFeatured      = true; L('LIST', '  isFeatured      = true'); }

    if (andClauses.length) query.$and = andClauses;

    // ── Sort ───────────────────────────────────────────────
    const sortMap = {
      rating:     { averageRating: -1 },
      reviews:    { totalReviews:  -1 },
      experience: { experience:    -1 },
      fee_asc:    { consultationFee: 1 },
      fee_desc:   { consultationFee: -1 },
      rank:       { rank: 1 },
      newest:     { createdAt: -1 },
    };
    const sort = sortMap[sortBy] || { isFeatured: -1, rank: 1, averageRating: -1 };
    L('LIST', `  sortBy = "${sortBy || 'default'}" →`, JSON.stringify(sort));

    // ── Final query log ────────────────────────────────────
    L('LIST', 'Final MongoDB query:');
    console.log(JSON.stringify(query, null, 2));

    // ── Count first for diagnostics ────────────────────────
    const total = await Doctor.countDocuments(query);
    L('LIST', `countDocuments → ${total}`);

    if (total === 0) {
      LW('LIST', 'ZERO RESULTS — running diagnostics...');

      const totalInDB    = await Doctor.countDocuments({});
      const totalActive  = await Doctor.countDocuments({ isActive: true });
      const totalInactive= await Doctor.countDocuments({ isActive: false });
      LW('LIST', `  Total docs in collection : ${totalInDB}`);
      LW('LIST', `  isActive: true           : ${totalActive}`);
      LW('LIST', `  isActive: false          : ${totalInactive}`);

      if (totalActive === 0) {
        LW('LIST', '  ⚠ NO active docs at all — check seed data was imported + isActive=true');
      } else {
        // Check city specifically
        if (city) {
          const cityCount = await Doctor.countDocuments({ isActive: true, primaryCity: new RegExp(city, 'i') });
          LW('LIST', `  Docs with primaryCity≈"${city}": ${cityCount}`);
          if (cityCount === 0) {
            // Show distinct cities in DB
            const cities = await Doctor.distinct('primaryCity', { isActive: true });
            LW('LIST', `  Actual primaryCity values in DB: [${cities.join(', ')}]`);
          }
        }

        // Check specialization specifically
        if (specialization) {
          const specCount = await Doctor.countDocuments({
            isActive: true,
            $or: [
              { 'specializations.slug': new RegExp(specialization, 'i') },
              { 'specializations.name': new RegExp(specialization.replace(/-/g,' '), 'i') },
            ]
          });
          LW('LIST', `  Docs matching specialization "${specialization}": ${specCount}`);
          if (specCount === 0) {
            const slugs = await Doctor.distinct('specializations.slug', { isActive: true });
            const names = await Doctor.distinct('specializations.name', { isActive: true });
            LW('LIST', `  Actual specializations.slug in DB: [${slugs.filter(Boolean).join(', ')}]`);
            LW('LIST', `  Actual specializations.name in DB: [${names.filter(Boolean).join(', ')}]`);
          }
        }

        // Check fee range
        if (minFee || maxFee) {
          const feeCount = await Doctor.countDocuments({ isActive: true, consultationFee: { $gt: 0 } });
          LW('LIST', `  Docs with consultationFee > 0: ${feeCount}`);
          if (feeCount === 0) {
            LW('LIST', '  ⚠ No docs have root-level consultationFee — check seed data field names');
          }
        }

        // Show one sample doc for field inspection
        const sample = await Doctor.findOne({ isActive: true }).lean();
        if (sample) {
          LW('LIST', '  Sample document field snapshot:');
          console.log(JSON.stringify({
            _id:              sample._id,
            name:             sample.name,
            slug:             sample.slug,
            primaryCity:      sample.primaryCity,
            primaryArea:      sample.primaryArea,
            consultationFee:  sample.consultationFee,
            averageRating:    sample.averageRating,
            totalReviews:     sample.totalReviews,
            isActive:         sample.isActive,
            isFeatured:       sample.isFeatured,
            consultationMode: sample.consultationMode,
            specializations:  sample.specializations,
            'clinics[0].fees':          sample.clinics?.[0]?.fees,
            'clinics[0].consultationFee': sample.clinics?.[0]?.consultationFee,
            'rating.value':   sample.rating?.value,
            'rating.count':   sample.rating?.count,
          }, null, 2));
        }
      }
    }

    const skip    = (Number(page) - 1) * Number(limit);
    const raw     = await Doctor.find(query).sort(sort).skip(skip).limit(Number(limit)).lean();
    const doctors = raw.map(normalize);

    L('LIST', `Returning ${doctors.length} doctors (page ${page}/${Math.ceil(total / Number(limit))})`);
    if (doctors.length) {
      L('LIST', `  First: "${doctors[0].name}" | area="${doctors[0].primaryArea}" | fee=${doctors[0].consultationFee} | rating=${doctors[0].averageRating} | specs=${JSON.stringify((doctors[0].specializations||[]).map(s=>s.name))}`);
    }
    LINE();

    res.json({
      success: true,
      count: doctors.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      doctors,
    });
  } catch (err) {
    LE('LIST', err.message);
    console.error(err.stack);
    LINE();
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/featured
// ─────────────────────────────────────────────────────────────────────────────
router.get('/featured', async (req, res) => {
  L('FEATURED', 'GET /api/doctors/featured');
  try {
    const raw = await Doctor.find({ isFeatured: true, isActive: true })
      .sort({ rank: 1, averageRating: -1 }).limit(8).lean();
    L('FEATURED', `Found ${raw.length} featured doctors`);

    if (raw.length === 0) {
      const totalActive  = await Doctor.countDocuments({ isActive: true });
      const withFeatured = await Doctor.countDocuments({ isFeatured: true });
      LW('FEATURED', `  isActive docs: ${totalActive}  |  isFeatured=true docs: ${withFeatured}`);
      if (withFeatured === 0) LW('FEATURED', '  ⚠ No docs have isFeatured=true — seed data may not have set this field');
    }

    res.json({ success: true, doctors: raw.map(normalize) });
  } catch (err) {
    LE('FEATURED', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/top-rated
// ─────────────────────────────────────────────────────────────────────────────
router.get('/top-rated', async (req, res) => {
  L('TOP-RATED', `city="${req.query.city || 'any'}"`);
  try {
    const { city } = req.query;
    const q = { isActive: true, averageRating: { $gt: 0 } };
    if (city) q.primaryCity = new RegExp(city, 'i');
    const raw = await Doctor.find(q).sort({ averageRating: -1, totalReviews: -1 }).limit(10).lean();
    L('TOP-RATED', `Found ${raw.length}`);
    if (raw.length === 0) {
      const noRating = await Doctor.countDocuments({ isActive: true, averageRating: { $lte: 0 } });
      LW('TOP-RATED', `  Docs with averageRating <= 0: ${noRating} — check field is populated`);
    }
    res.json({ success: true, doctors: raw.map(normalize) });
  } catch (err) {
    LE('TOP-RATED', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/autocomplete?q=...
// ─────────────────────────────────────────────────────────────────────────────
router.get('/autocomplete', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });
    const re = new RegExp(q, 'i');
    const [names, conditions, procedures, specs] = await Promise.all([
      Doctor.distinct('name',                  { name: re, isActive: true }),
      Doctor.distinct('conditionsTreated',     { conditionsTreated: re, isActive: true }),
      Doctor.distinct('proceduresOffered',     { proceduresOffered: re, isActive: true }),
      Doctor.distinct('specializations.name',  { 'specializations.name': re, isActive: true }),
    ]);
    L('AUTOCOMPLETE', `q="${q}" → names:${names.length} specs:${specs.length} conditions:${conditions.length} procedures:${procedures.length}`);
    res.json({ success: true, suggestions: [
      ...names.slice(0,3).map(v      => ({ type: 'doctor',         value: v })),
      ...specs.slice(0,3).map(v      => ({ type: 'specialization', value: v })),
      ...conditions.slice(0,4).map(v => ({ type: 'condition',      value: v })),
      ...procedures.slice(0,3).map(v => ({ type: 'procedure',      value: v })),
    ]});
  } catch (err) {
    LE('AUTOCOMPLETE', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/filters/meta
// ─────────────────────────────────────────────────────────────────────────────
router.get('/filters/meta', async (req, res) => {
  L('META', `city="${req.query.city || 'any'}"`);
  try {
    const { city } = req.query;
    const match = { isActive: true };
    if (city) match.primaryCity = new RegExp(city, 'i');

    const [conditions, procedures, areas, specNames] = await Promise.all([
      Doctor.distinct('conditionsTreated',    match),
      Doctor.distinct('proceduresOffered',    match),
      Doctor.distinct('primaryArea',          match),
      Doctor.distinct('specializations.name', match),
    ]);

    L('META', `conditions:${conditions.filter(Boolean).length}  procedures:${procedures.filter(Boolean).length}  areas:${areas.filter(Boolean).length}  specs:${specNames.filter(Boolean).length}`);
    L('META', `  areas : [${areas.filter(Boolean).join(', ')}]`);
    L('META', `  specs : [${specNames.filter(Boolean).join(', ')}]`);

    if (specNames.filter(Boolean).length === 0) {
      LW('META', '  ⚠ No specializations found — specializations.name may be empty in all docs');
      const sample = await Doctor.findOne({ isActive: true }).lean();
      LW('META', '  specializations field in sample doc:', JSON.stringify(sample?.specializations));
    }

    const specializations = specNames.filter(Boolean).sort().map(name => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon: '🩺',
    }));

    res.json({
      success: true,
      conditions:      conditions.filter(Boolean).sort(),
      procedures:      procedures.filter(Boolean).sort(),
      areas:           areas.filter(Boolean).sort(),
      specializations,
    });
  } catch (err) {
    LE('META', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/doctors/:slug
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  L('SLUG', `slug="${req.params.slug}"`);
  try {
    const raw = await Doctor.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!raw) {
      LW('SLUG', `Not found: "${req.params.slug}"`);
      const anyMatch = await Doctor.findOne({ slug: req.params.slug }).lean();
      if (anyMatch) LW('SLUG', `  Doc exists but isActive=${anyMatch.isActive} — it is deactivated`);
      else          LW('SLUG', '  Slug does not exist in DB at all');
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    L('SLUG', `Found: "${raw.name}"`);
    res.json({ success: true, doctor: normalize(raw) });
  } catch (err) {
    LE('SLUG', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin routes
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.consultationMode) body.availableOnline = ['Online','Both'].includes(body.consultationMode);
    const doctor = await Doctor.create(body);
    L('CREATE', `Created "${doctor.name}" slug="${doctor.slug}"`);
    res.status(201).json({ success: true, doctor: normalize(doctor) });
  } catch (err) {
    LE('CREATE', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.consultationMode) body.availableOnline = ['Online','Both'].includes(body.consultationMode);
    const raw = await Doctor.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true }).lean();
    if (!raw) return res.status(404).json({ success: false, message: 'Doctor not found' });
    L('UPDATE', `Updated "${raw.name}"`);
    res.json({ success: true, doctor: normalize(raw) });
  } catch (err) {
    LE('UPDATE', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).lean();
    L('DELETE', `Soft-deleted "${doc?.name || req.params.id}"`);
    res.json({ success: true, message: 'Doctor listing deactivated' });
  } catch (err) {
    LE('DELETE', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;