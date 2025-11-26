const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email phone profileImage')
      .sort({ rating: -1 });
    
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

module.exports = router;