const mongoose = require('mongoose');
const slugify = require('slugify');

const architectSchema = new mongoose.Schema({

  // ── Basic Info ───────────────────────────────────────────────
  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  firmName: String, // "Studio XYZ Architects"

  experience: Number, // years

  bio: String, // short description for profile page

  media: {
  profileImage: String,
  coverImage: String,
  gallery: [String]
},


  // ── Specializations ──────────────────────────────────────────
  specializations: [
    {
      name: String, // "Residential", "Commercial", "Interior"
      subSpecializations: [String] // "Villa Design", "Office Interiors"
    }
  ],


  // ── Design Styles (VERY IMPORTANT UX FILTER) ─────────────────
  designStyles: [
    String // "Modern", "Minimalist", "Traditional", "Contemporary"
  ],


  // ── Services Offered ─────────────────────────────────────────
  servicesOffered: [
    String // "Architecture Planning", "Interior Design", "3D Rendering"
  ],


  // ── Projects / Portfolio (CORE FEATURE) ──────────────────────
  projects: [
    {
      title: String,

      projectType: String, // "Villa", "Apartment", "Office"

      location: {
        area: String,
        city: String,
        state: String
      },

      budgetRange: String, // "10L - 20L"

      areaSize: String, // "2000 sqft"

      completionYear: Number,

      description: String,

      images: [String], // URLs

      thumbnail: String
    }
  ],


  // ── Offices / Studio Locations ───────────────────────────────
  offices: [
    {
      name: String,

      address: String,
      area: String,
      city: String,
      state: String,
      pincode: String,

      phone: String,

      timingText: String, // "Mon–Sat 10AM–6PM"

      consultationFee: Number,
      feeText: String,

      googleMapsLink: String
    }
  ],


  // ── Primary Location ─────────────────────────────────────────
  primaryCity: {
    type: String,
    index: true
  },

  primaryArea: String,


  // ── Pricing & Budget (CRITICAL FILTER) ───────────────────────
  pricing: {
    consultationFee: Number,

    pricePerSqft: Number, // e.g., 100/sqft

    minBudget: Number,
    maxBudget: Number
  },


  // ── Ratings & Reviews ────────────────────────────────────────
  rating: {
    value: Number,
    count: Number,
    text: String
  },


  // ── Contact ─────────────────────────────────────────────────
  contact: {
    phone: String,
    email: String,
    website: String,
    verified: { type: Boolean, default: false }
  },


  // ── Social Proof (VERY IMPORTANT FOR TRUST) ──────────────────
  socialLinks: {
    instagram: String,
    linkedin: String,
    behance: String,
    website: String
  },

verification: {
  isVerified: { type: Boolean, default: false },
  documentsVerified: Boolean,
  profileCompleted: Number // %
},

  // ── SEO / Discovery ──────────────────────────────────────────
  tags: [String], // "luxury homes", "budget homes", etc.


 
  // ── Flags ───────────────────────────────────────────────────
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }

}, { timestamps: true });


// ── Slug Generation ───────────────────────────────────────────
architectSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('name')) {
    this.slug = slugify(`${this.name}-${Date.now()}`, { lower: true });
  }
  next();
});



// ── Indexes (IMPORTANT FOR SEARCH PERFORMANCE) ────────────────
architectSchema.index({ name: 'text', firmName: 'text', tags: 'text' });
architectSchema.index({ primaryCity: 1, primaryArea: 1 });
architectSchema.index({ designStyles: 1 });
architectSchema.index({ "specializations.name": 1 });
architectSchema.index({ "projects.projectType": 1 });
architectSchema.index({ "rating.value": -1 });
architectSchema.index({ "pricing.minBudget": 1, "pricing.maxBudget": 1 });

module.exports = mongoose.model('Architect', architectSchema);