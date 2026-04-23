const express = require('express');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// @route   GET /api/doctors/:doctorId/reviews
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const query = { doctor: req.params.doctorId, isApproved: true };
    
    let sortObj = { createdAt: -1 };
    if (sort === 'highest') sortObj = { rating: -1 };
    if (sort === 'lowest') sortObj = { rating: 1 };
    if (sort === 'helpful') sortObj = { helpfulCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments(query);

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    // Rating distribution
    const distribution = await Review.aggregate([
      { $match: { doctor: require('mongoose').Types.ObjectId.createFromHexString(req.params.doctorId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, reviews, total, pages: Math.ceil(total / Number(limit)), distribution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/doctors/:doctorId/reviews
router.post('/', protect, async (req, res) => {
  try {
    const existing = await Review.findOne({ doctor: req.params.doctorId, user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this doctor' });

    const review = await Review.create({
      doctor: req.params.doctorId,
      user: req.user.id,
      ...req.body
    });
    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/doctors/:doctorId/reviews/:id/helpful
router.put('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    res.json({ success: true, helpfulCount: review.helpfulCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
