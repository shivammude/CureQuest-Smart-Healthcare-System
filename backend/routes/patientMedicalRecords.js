const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

// @route POST /api/patient/medical-records
// @desc Patient creates own medical record
// @access Private (Patient only)
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const {
      diagnosis,
      symptoms,
      notes,
      vitalSigns,
      assignedDoctorId
    } = req.body;

    const record = await MedicalRecord.create({
      patientId: patient._id,
      assignedDoctorId,
      diagnosis,
      symptoms: symptoms || [],
      vitalSigns,
      notes,
      createdBy: 'patient',
      visitDate: new Date()
    });

    res.status(201).json({
      success: true,
      record
    });

  } catch (error) {
    console.error("Patient Create Record Error:", error);
    res.status(500).json({ message: "Error creating medical record" });
  }
});

module.exports = router;
