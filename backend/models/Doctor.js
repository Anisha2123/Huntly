const mongoose = require('mongoose');
const slugify = require('slugify');

const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  // ── Qualifications & Experience ───────────────────────────────
  qualificationText: String,

  experience: {
    type: Number,
    default: null
  },

  // ── Specializations (UPDATED) ─────────────────────────────────
  specializations: [
    {
      name: String, // "Gynecology"
      subSpecializations: [String] // ["PCOS", "IVF", "High-Risk Pregnancy"]
    }
  ],

  // ── Conditions & Procedures ───────────────────────────────────
  conditionsTreated: [String],
  proceduresOffered: [String],

  // ── Clinics / Hospitals (UPDATED) ─────────────────────────────
  clinics: [
    {
      name: String,

      address: String,
      area: String,
      city: String,
      state: String,
      pincode: String,

      phone: String,

      // Raw timing (IMPORTANT for UI display)
      timingText: String,   // "Daily", "Mon–Sat 5–8 PM"

      // Structured timing (optional future use)
      timings: [
        {
          day: String,
          startTime: String,
          endTime: String
        }
      ],

      consultationFee: Number,
      feeText: String, // "₹700", "500-800"

      googleMapsLink: String
    }
  ],

  // ── Primary Location ──────────────────────────────────────────
  primaryCity: {
    type: String,
    default: 'Jaipur',
    index: true
  },

  primaryArea: String,

  // ── Contact ──────────────────────────────────────────────────
  contact: {
    phone: String,
    email: String,
    verified: { type: Boolean, default: false }
  },

  // ── Consultation Mode ────────────────────────────────────────
  consultationMode: {
    type: String,
    enum: ['Clinic', 'Online', 'Both'],
    default: 'Clinic'
  },

  // ── Ratings (UPDATED) ────────────────────────────────────────
  rating: {
    value: Number,   // 4.9
    count: Number,   // 500
    text: String     // "4.9/5 | 500+ Reviews"
  },

  // ── Ranking ──────────────────────────────────────────────────
  rank: Number,
  areaRank: Number,

  // ── Raw Source Data (VERY IMPORTANT) ─────────────────────────
  source: {
    fullAddress: String,
    rawHours: String,
    rawFee: String,
    rawRating: String,
    rawReviews: String
  },

  // ── Flags ────────────────────────────────────────────────────
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }

}, { timestamps: true });


// ── Slug ───────────────────────────────────────────────────────
doctorSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true });
  }
  next();
});


// ── Indexes ────────────────────────────────────────────────────
doctorSchema.index({ name: 'text' });
doctorSchema.index({ primaryCity: 1, primaryArea: 1 });
doctorSchema.index({ "specializations.name": 1 });
doctorSchema.index({ "specializations.subSpecializations": 1 });
doctorSchema.index({ "rating.value": -1 });

module.exports = mongoose.model('Doctor', doctorSchema);