// routes/prescriptions.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');
const mongoose = require("mongoose");

// @route   POST /api/prescriptions
// @desc    Create prescription
// @access  Private (Doctor only)
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    let {
      patientId,
      appointmentId,
      medicalRecordId,
      medications,
      advice
    } = req.body;

    // Convert empty medicalRecordId → undefined (IMPORTANT)
    if (!medicalRecordId || medicalRecordId === "") {
      medicalRecordId = undefined;
    }

    // Validate medications
    if (!medications || medications.length === 0) {
      return res.status(400).json({ message: 'At least one medication is required' });
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      medicalRecordId,
      medications,
      advice
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization qualification' }
      });

    res.status(201).json({
      success: true,
      prescription: populatedPrescription
    });

  } catch (error) {
    console.error('Create Prescription Error:', error);
    res.status(500).json({ message: 'Error creating prescription' });
  }
});


// @route   GET /api/prescriptions/patient/:patientId
// @desc    Get patient's prescriptions
// @access  Private
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Authorization
    const userPatient = await Patient.findOne({ userId: req.user._id });
    const isAuthorized = 
      req.user.role === 'admin' ||
      req.user.role === 'doctor' ||
      (userPatient && userPatient._id.equals(patient._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization' }
      })
      .sort({ prescriptionDate: -1 });

    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    console.error('Get Prescriptions Error:', error);
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone specialization qualification' }
      });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Authorization
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && prescription.patientId._id.equals(patient._id)) ||
      (doctor && prescription.doctorId._id.equals(doctor._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    console.error('Get Prescription Error:', error);
    res.status(500).json({ message: 'Error fetching prescription' });
  }
});

// @route   GET /api/prescriptions/:id/pdf
// @desc    Generate prescription PDF
// @access  Private
router.get('/:id/pdf', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone specialization qualification' }
      });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Authorization check (same as above)
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && prescription.patientId._id.equals(patient._id)) ||
      (doctor && prescription.doctorId._id.equals(doctor._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Return prescription data for PDF generation on frontend
    res.json({ success: true, prescription });
  } catch (error) {
    console.error('Get Prescription PDF Error:', error);
    res.status(500).json({ message: 'Error generating prescription PDF' });
  }
});

// @route   GET /api/prescriptions/doctor/:doctorId
// @desc    Get prescriptions created by a specific doctor
// @access  Private (Doctor only)
router.get('/doctor/:doctorId', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Authorization check
    const loggedInDoctor = await Doctor.findOne({ userId: req.user._id });
    const isAuthorized =
      req.user.role === 'admin' ||
      (loggedInDoctor && loggedInDoctor._id.equals(doctor._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view these prescriptions' });
    }

    // Fetch prescriptions for this doctor
    const prescriptions = await Prescription.find({ doctorId: req.params.doctorId })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization qualification' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error('Get Doctor Prescriptions Error:', error);
    res.status(500).json({ message: 'Error fetching doctor prescriptions' });
  }
});

module.exports = router;