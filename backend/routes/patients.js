const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/patients
// @desc    Get all patients (Doctor/Admin only)
// @access  Private
router.get('/', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

module.exports = router;