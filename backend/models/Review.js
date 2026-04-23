const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: 1000
  },
  visitType: {
    type: String,
    enum: ['clinic', 'online'],
    default: 'clinic'
  },
  recommended: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// One review per user per doctor
reviewSchema.index({ doctor: 1, user: 1 }, { unique: true });

// Update doctor's average rating after save
reviewSchema.post('save', async function() {
  await updateDoctorRating(this.doctor);
});

reviewSchema.post('remove', async function() {
  await updateDoctorRating(this.doctor);
});

async function updateDoctorRating(doctorId) {
  const Doctor = mongoose.model('Doctor');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { doctor: doctorId, isApproved: true } },
    {
      $group: {
        _id: '$doctor',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  } else {
    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
}

module.exports = mongoose.model('Review', reviewSchema);
