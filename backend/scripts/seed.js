require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Review = require('../models/Review');

const categories = [
  { name: 'Cardiologist', icon: '❤️', description: 'Heart and cardiovascular specialists' },
  { name: 'Dermatologist', icon: '🧴', description: 'Skin, hair and nail specialists' },
  { name: 'Dentist', icon: '🦷', description: 'Dental and oral health specialists' },
  { name: 'Orthopedist', icon: '🦴', description: 'Bone and joint specialists' },
  { name: 'Neurologist', icon: '🧠', description: 'Brain and nervous system specialists' },
  { name: 'Pediatrician', icon: '👶', description: 'Children health specialists' },
  { name: 'Ophthalmologist', icon: '👁️', description: 'Eye specialists' },
  { name: 'Gynecologist', icon: '🌸', description: 'Women health specialists' },
  { name: 'Psychiatrist', icon: '🧘', description: 'Mental health specialists' },
  { name: 'ENT Specialist', icon: '👂', description: 'Ear, nose and throat specialists' },
  { name: 'General Physician', icon: '🩺', description: 'General medicine practitioners' },
  { name: 'Urologist', icon: '💊', description: 'Urinary system specialists' },
];

const locations = [
  { city: 'Mumbai', state: 'Maharashtra', areas: [{ name: 'Bandra' }, { name: 'Andheri' }, { name: 'Juhu' }, { name: 'Powai' }] },
  { city: 'Delhi', state: 'Delhi', areas: [{ name: 'Connaught Place' }, { name: 'Dwarka' }, { name: 'Saket' }] },
  { city: 'Bangalore', state: 'Karnataka', areas: [{ name: 'Koramangala' }, { name: 'Indiranagar' }, { name: 'Whitefield' }] },
  { city: 'Chennai', state: 'Tamil Nadu', areas: [{ name: 'T. Nagar' }, { name: 'Anna Nagar' }, { name: 'Adyar' }] },
  { city: 'Hyderabad', state: 'Telangana', areas: [{ name: 'Banjara Hills' }, { name: 'Jubilee Hills' }] },
  { city: 'Pune', state: 'Maharashtra', areas: [{ name: 'Koregaon Park' }, { name: 'Kothrud' }] },
  { city: 'Jaipur', state: 'Rajasthan', areas: [{ name: 'C-Scheme' }, { name: 'Vaishali Nagar' }, { name: 'Malviya Nagar' }] },
];

const doctorNames = [
  'Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Anand Mehta', 'Dr. Sunita Patel',
  'Dr. Vikram Singh', 'Dr. Meena Reddy', 'Dr. Arun Nair', 'Dr. Kavitha Iyer',
  'Dr. Suresh Verma', 'Dr. Anjali Gupta', 'Dr. Deepak Joshi', 'Dr. Rekha Malhotra',
  'Dr. Harish Chandran', 'Dr. Pooja Desai', 'Dr. Manoj Tiwari', 'Dr. Sheela Pillai',
  'Dr. Ashok Rao', 'Dr. Nisha Kapoor', 'Dr. Ravi Shankar', 'Dr. Lalitha Menon'
];

const qualifications = [
  [{ degree: 'MBBS', institution: 'AIIMS Delhi' }, { degree: 'MD', institution: 'PGI Chandigarh' }],
  [{ degree: 'MBBS', institution: 'Maulana Azad Medical College' }, { degree: 'MS', institution: 'JIPMER' }],
  [{ degree: 'BDS', institution: 'Manipal University' }, { degree: 'MDS', institution: 'KLE University' }],
  [{ degree: 'MBBS', institution: 'Grant Medical College' }, { degree: 'DM', institution: 'SGPGI Lucknow' }],
];

async function seed() {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing
  await Promise.all([Category.deleteMany(), Location.deleteMany(), Doctor.deleteMany(), Review.deleteMany(), User.deleteMany()]);

  // Seed categories
  const cats = await Category.create(categories);
  console.log(`✅ Created ${cats.length} categories`);

  // Seed locations
  const locs = await Location.create(locations);
  console.log(`✅ Created ${locs.length} locations`);

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@Huntly.com',
    password: 'admin123',
    role: 'admin'
  });

  // Create patient users for reviews
  const patients = await User.create([
    { name: 'Rahul Sharma', email: 'rahul@test.com', password: 'test123' },
    { name: 'Priya Gupta', email: 'priya@test.com', password: 'test123' },
    { name: 'Amit Patel', email: 'amit@test.com', password: 'test123' },
    { name: 'Sneha Reddy', email: 'sneha@test.com', password: 'test123' },
    { name: 'Kiran Joshi', email: 'kiran@test.com', password: 'test123' },
  ]);
  console.log(`✅ Created ${patients.length + 1} users`);

  // Seed doctors
  const doctors = [];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur'];
  const areas = ['Bandra', 'Koramangala', 'T. Nagar', 'Banjara Hills', 'C-Scheme', 'Kothrud', 'Andheri'];

  for (let i = 0; i < 40; i++) {
    const catCount = Math.floor(Math.random() * 2) + 1;
    const shuffledCats = cats.sort(() => 0.5 - Math.random()).slice(0, catCount);
    const city = cities[i % cities.length];
    const area = areas[i % areas.length];

    const doc = {
      name: doctorNames[i % doctorNames.length] + (i >= doctorNames.length ? ` ${Math.floor(i/doctorNames.length) + 1}` : ''),
      specializations: shuffledCats.map(c => c._id),
      qualifications: qualifications[i % qualifications.length],
      experience: Math.floor(Math.random() * 25) + 3,
      about: `Experienced specialist with over ${Math.floor(Math.random() * 20) + 3} years of clinical experience. Dedicated to providing comprehensive and compassionate care to all patients.`,
      languages: ['English', 'Hindi', i % 3 === 0 ? 'Marathi' : i % 3 === 1 ? 'Tamil' : 'Telugu'],
      primaryCity: city,
      primaryArea: area,
      clinics: [{
        name: `${doctorNames[i % doctorNames.length].split(' ').slice(-1)[0]} Clinic`,
        address: `${Math.floor(Math.random() * 100) + 1}, ${area} Main Road`,
        area,
        city,
        state: 'India',
        phone: `+91 98${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
        fees: Math.floor(Math.random() * 800) + 300,
        timings: [
          { day: 'Monday-Saturday', startTime: '09:00 AM', endTime: '01:00 PM' },
          { day: 'Monday-Friday', startTime: '05:00 PM', endTime: '08:00 PM' },
        ]
      }],
      consultationFee: Math.floor(Math.random() * 800) + 300,
      onlineFee: Math.floor(Math.random() * 500) + 200,
      services: shuffledCats.flatMap(c => [c.name + ' Consultation', 'Follow-up Visit', 'Emergency Care']),
      availableOnline: i % 3 === 0,
      availableToday: i % 4 !== 0,
      isFeatured: i < 8,
      isVerified: i % 2 === 0,
      badge: i < 5 ? 'Top Doctor' : i < 10 ? 'Highly Rated' : i < 15 ? 'Most Booked' : null,
    };
    doctors.push(doc);
  }

  const createdDoctors = await Doctor.insertMany(doctors);
  console.log(`✅ Created ${createdDoctors.length} doctors`);

  // Seed reviews
  const reviews = [];
  const reviewComments = [
    'Excellent doctor! Very thorough and patient. Highly recommend.',
    'Great experience. The doctor explained everything clearly.',
    'Very knowledgeable and professional. Wait time was minimal.',
    'Fantastic consultation. Dr. was very empathetic and helpful.',
    'Good doctor but the clinic was a bit crowded.',
    'Outstanding care. Will definitely visit again.',
    'Very experienced doctor. Treatment was very effective.',
    'Helpful and friendly. Made me feel comfortable throughout.',
  ];

  for (let d = 0; d < Math.min(20, createdDoctors.length); d++) {
    const numReviews = Math.floor(Math.random() * 4) + 2;
    for (let r = 0; r < Math.min(numReviews, patients.length); r++) {
      reviews.push({
        doctor: createdDoctors[d]._id,
        user: patients[r]._id,
        rating: Math.floor(Math.random() * 2) + 4,
        title: r % 2 === 0 ? 'Great Experience' : 'Highly Recommended',
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        visitType: r % 2 === 0 ? 'clinic' : 'online',
        recommended: true,
      });
    }
  }

  // Remove duplicate doctor+user combos
  const uniqueReviews = reviews.filter((r, i, arr) => 
    arr.findIndex(x => x.doctor.toString() === r.doctor.toString() && x.user.toString() === r.user.toString()) === i
  );

  await Review.insertMany(uniqueReviews);
  console.log(`✅ Created ${uniqueReviews.length} reviews`);

  // Update category doctor counts
  for (const cat of cats) {
    const count = await Doctor.countDocuments({ specializations: cat._id, isActive: true });
    await Category.findByIdAndUpdate(cat._id, { doctorCount: count });
  }

  // Manually update ratings since hooks may not trigger on insertMany
  for (const doc of createdDoctors.slice(0, 20)) {
    const stats = await Review.aggregate([
      { $match: { doctor: doc._id } },
      { $group: { _id: '$doctor', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats.length > 0) {
      await Doctor.findByIdAndUpdate(doc._id, {
        averageRating: Math.round(stats[0].avg * 10) / 10,
        totalReviews: stats[0].count
      });
    }
  }

  console.log('🎉 Seed completed!');
  console.log('📧 Admin: admin@Huntly.com / admin123');
  console.log('📧 Patient: rahul@test.com / test123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
