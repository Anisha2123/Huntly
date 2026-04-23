const express = require('express');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const { body, validationResult } = require('express-validator');
const { Resend } = require('resend');          // npm install resend
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY); // add to .env

/* ── helpers ────────────────────────────────────────────── */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// In-memory OTP store  { email → { otp, expiresAt, data } }
// For production swap this with Redis or a DB collection
const otpStore = new Map();

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const sendOtpEmail = async (email, otp, name) => {
  try
  {
  const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: "noirsevendigitalsolutions@gmail.com",
      subject: `${otp} — Your MedList verification code`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FFFAF4;border-radius:16px">
        <div style="width:44px;height:44px;background:#D25380;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px">
          <span style="color:#fff;font-size:20px;font-weight:700">M</span>
        </div>
        <h2 style="margin:0 0 8px;color:#2A1520;font-size:22px">Hi ${name || 'there'} 👋</h2>
        <p style="color:#7A4A58;margin:0 0 24px;line-height:1.6">
          Use the code below to verify your email. It expires in <strong>10 minutes</strong>.
        </p>
        <div style="background:#fff;border:1.5px solid rgba(210,83,128,0.2);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:700;color:#D25380;letter-spacing:8px">${otp}</span>
        </div>
        <p style="color:#AA8090;font-size:12px;margin:0">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
    console.log("Email sent:", response);
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
}
};

/* ─────────────────────────────────────────────────────────
   POST /api/auth/send-otp
   Step 1 — collect details, store temporarily, email OTP
───────────────────────────────────────────────────────── */
router.post('/send-otp', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { name, email, password, phone } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const otp        = generateOtp();
    const expiresAt  = Date.now() + 10 * 60 * 1000; // 10 min

    // Store pending registration data alongside OTP
    otpStore.set(email, { otp, expiresAt, data: { name, email, password, phone } });

    await sendOtpEmail(email, otp, name);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP. Try again.' });
  }
});

/* ─────────────────────────────────────────────────────────
   POST /api/auth/verify-otp
   Step 2 — verify OTP, create account, return token
───────────────────────────────────────────────────────── */
router.post('/verify-otp', [
  body('email').isEmail(),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit code'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record)
    return res.status(400).json({ success: false, message: 'No pending registration for this email' });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP expired. Please register again.' });
  }

  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: 'Incorrect OTP' });

  otpStore.delete(email); // consume

  try {
    const user  = await User.create(record.data);
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────
   POST /api/auth/resend-otp
───────────────────────────────────────────────────────── */
router.post('/resend-otp', [
  body('email').isEmail(),
], async (req, res) => {
  const { email } = req.body;
  const record = otpStore.get(email);

  if (!record)
    return res.status(400).json({ success: false, message: 'No pending registration found' });

  const otp       = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpStore.set(email, { ...record, otp, expiresAt });

  try {
    await sendOtpEmail(email, otp, record.data.name);
    res.json({ success: true, message: 'New OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
});

/* ─────────────────────────────────────────────────────────
   POST /api/auth/login  (unchanged logic)
───────────────────────────────────────────────────────── */
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({
      success: true, token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ─────────────────────────────────────────────────────────
   GET  /api/auth/me
   PUT  /api/auth/me
   POST /api/auth/save-doctor/:id
───────────────────────────────────────────────────────── */
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('savedDoctors', 'name slug photo averageRating specializations');
  res.json({ success: true, user });
});

router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, { name, phone }, { new: true, runValidators: true },
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/save-doctor/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idx  = user.savedDoctors.indexOf(req.params.id);
    if (idx > -1) user.savedDoctors.splice(idx, 1);
    else          user.savedDoctors.push(req.params.id);
    await user.save();
    res.json({ success: true, saved: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;