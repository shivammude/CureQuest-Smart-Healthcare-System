const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'password123',
      phone: '+919876543210',
      role: 'admin'
    });

    // Create doctor
    const doctorUser = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'doctor@demo.com',
      password: 'password123',
      phone: '+919876543211',
      role: 'doctor'
    });

    await Doctor.create({
      userId: doctorUser._id,
      specialization: 'Cardiologist',
      qualification: 'MBBS, MD (Cardiology)',
      experience: 10,
      consultationFee: 500,
      rating: 4.8,
      reviewCount: 124
    });

    // Create patient
    const patientUser = await User.create({
      name: 'John Doe',
      email: 'patient@demo.com',
      password: 'password123',
      phone: '+919876543212',
      role: 'patient'
    });

    await Patient.create({
      userId: patientUser._id,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      bloodGroup: 'O+'
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();