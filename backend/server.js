


require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();


// ✅ ADD THIS HERE
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const { categoryRouter, locationRouter } = require('./routes/categories');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/doctors/:doctorId/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/locations', locationRouter);

// Stats endpoint
// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Doctor = require('./models/Doctor');
    const Review = require('./models/Review');
    const User   = require('./models/User');

    const [doctors, reviews, users, specializationNames] = await Promise.all([
      // Count active doctors
      Doctor.countDocuments({ isActive: true }),

      // Count approved reviews
      Review.countDocuments({ isApproved: true }),

      // Count patient users
      User.countDocuments({ role: 'patient' }),

      // Count DISTINCT specialization names from the embedded array in doctors
      // This is the correct source — not a separate Category collection
      Doctor.distinct('specializations.name', { isActive: true }),
    ]);

    // Filter out any null/empty values before counting
    const categories = specializationNames.filter(Boolean).length;

    res.json({
      success: true,
      stats: { doctors, reviews, users, categories },
    });
  } catch (err) {
    console.error('[STATS]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Huntly API running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
