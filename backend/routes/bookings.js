const express = require('express');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, type, reason } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const fees = type === 'online' ? doctor.onlineFee : doctor.consultationFee;

    const booking = await Booking.create({
      doctor: doctorId,
      patient: req.user.id,
      appointmentDate,
      appointmentTime,
      type,
      reason,
      fees
    });

    await Doctor.findByIdAndUpdate(doctorId, { $inc: { totalBookings: 1 } });
    await booking.populate(['doctor', 'patient']);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ patient: req.user.id })
      .populate('doctor', 'name photo slug specializations primaryCity consultationFee')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, patient: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason;
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
