const mongoose = require('mongoose');
const slugify = require('slugify');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },

  // ── Qualifications & Experience ──────────────────────────────────
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  // Flat string for quick display  e.g. "MBBS, MD"
  qualificationText: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0,
    default: null   // nullable – not always known
  },
  registrationNumber: {
    type: String,
    unique: true,
    sparse: true
  },

  // ── Specializations (refs to Category) ──────────────────────────
  specializations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],

  // ── Clinical Details ─────────────────────────────────────────────
  conditionsTreated: [String],   // e.g. ["Acne", "Pigmentation", "Hair Fall"]
  proceduresOffered: [String],   // e.g. ["Chemical Peel", "Laser", "PRP"]

  // ── Profile ──────────────────────────────────────────────────────
  about: {
    type: String,
    maxlength: 2000
  },
  photo: {
    type: String,
    default: null
  },
  languages: [String],

  // ── Clinics / Hospitals ──────────────────────────────────────────
  clinics: [{
    name: String,
    address: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    googleMapsLink: String,
    timings: [{
      day: String,
      startTime: String,
      endTime: String
    }],
    fees: Number,
    isOnline: { type: Boolean, default: false }
  }],

  // ── Primary location (denormalized for fast filtering) ───────────
  primaryCity: {
    type: String,
    default: 'Jaipur',
    index: true
  },
  primaryArea: String,

  // ── Contact ──────────────────────────────────────────────────────
  phone: String,
  email: String,
  website: String,
  googleMapsLink: String,   // primary clinic maps link

  // ── Consultation Mode ────────────────────────────────────────────
  // "Clinic" | "Online" | "Both"
  consultationMode: {
    type: String,
    enum: ['Clinic', 'Online', 'Both'],
    default: 'Clinic'
  },

  // ── Fees ─────────────────────────────────────────────────────────
  consultationFee: {
    type: Number,
    default: null   // nullable – sometimes missing
  },
  onlineFee: {
    type: Number,
    default: null
  },

  // ── Services (generic / legacy) ──────────────────────────────────
  services: [String],

  // ── Equipment ────────────────────────────────────────────────────
  equipment: [String],

  // ── Availability ─────────────────────────────────────────────────
  availableOnline: {
    type: Boolean,
    default: false
  },
  availableToday: {
    type: Boolean,
    default: false
  },

  // ── Directory rank (Google rank / manual rank) ───────────────────
  rank: {
    type: Number,
    default: null
  },

  // ── Aggregated stats (denormalized) ──────────────────────────────
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews:  { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },

  // ── Premium flags ────────────────────────────────────────────────
  isFeatured: { type: Boolean, default: false },
  isVerified:  { type: Boolean, default: false },
  badge: {
    type: String,
    enum: ['Top Doctor', 'Highly Rated', 'Most Booked', null],
    default: null
  },
  isActive: { type: Boolean, default: true },

  // ── SEO ──────────────────────────────────────────────────────────
  metaTitle: String,
  metaDescription: String,

}, { timestamps: true });

// ── Slug auto-generation ─────────────────────────────────────────
doctorSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true });
  }
  // Keep availableOnline in sync with consultationMode
  if (this.isModified('consultationMode')) {
    this.availableOnline = ['Online', 'Both'].includes(this.consultationMode);
  }
  next();
});

// ── Indexes ──────────────────────────────────────────────────────
doctorSchema.index({
  name: 'text',
  about: 'text',
  qualificationText: 'text',
  conditionsTreated: 'text',
  proceduresOffered: 'text',
  services: 'text'
});
doctorSchema.index({ primaryCity: 1, averageRating: -1 });
doctorSchema.index({ primaryArea: 1 });
doctorSchema.index({ specializations: 1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ rank: 1 });
doctorSchema.index({ isFeatured: -1, averageRating: -1 });
doctorSchema.index({ conditionsTreated: 1 });
doctorSchema.index({ proceduresOffered: 1 });
doctorSchema.index({ consultationMode: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);