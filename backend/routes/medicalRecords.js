// routes/medicalRecords.js
const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/medical-records
// @desc    Create medical record
// @access  Private (Doctor only)
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const {
      patientId,
      appointmentId,
      diagnosis,
      symptoms,
      vitalSigns,
      labResults,
      notes,
      followUpRequired,
      followUpDate
    } = req.body;

    const medicalRecord = await MedicalRecord.create({
      patientId,
      appointmentId,
      doctorId: doctor._id,
      visitDate: new Date(),
      diagnosis,
      symptoms: symptoms || [],
      vitalSigns,
      labResults: labResults || [],
      notes,
      followUpRequired,
      followUpDate
    });

    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization' }
      });

    res.status(201).json({
      success: true,
      medicalRecord: populatedRecord
    });
  } catch (error) {
    console.error('Create Medical Record Error:', error);
    res.status(500).json({ message: 'Error creating medical record' });
  }
});

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get patient's medical records
// @access  Private (Doctor, Patient, Admin)
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Logged in patient (if role = patient)
    const loggedInPatient = await Patient.findOne({ userId: req.user._id });

    // Authorization: admin, doctor, or same patient
    const isAuthorized =
      req.user.role === 'admin' ||
      req.user.role === 'doctor' ||
      (loggedInPatient &&
       loggedInPatient._id.toString() === patient._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view these records' });
    }

    const records = await MedicalRecord.find({ patientId: req.params.patientId })
  .populate({
    path: 'patientId',
    populate: { path: 'userId', select: 'name email phone' }
  })
  .populate({
    path: 'doctorId',
    populate: { path: 'userId', select: 'name specialization' }
  })
  .sort({ visitDate: -1 });


    res.json({ success: true, count: records.length, records });

  } catch (error) {
    console.error('Get Medical Records Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/medical-records
// @desc    Get all medical records for the logged-in doctor
// @access  Private (Doctor only)
router.get('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const records = await MedicalRecord.find({ doctorId: doctor._id })
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization qualification' }
      })
      .sort({ visitDate: -1 });

    res.json({ success: true, count: records.length, records });
  } catch (error) {
    console.error('Get Doctor Medical Records Error:', error);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
});

// @route   GET /api/medical-records/patient-created
// @desc    Doctor views ONLY records created by patient
// @access  Private (Doctor only)
router.get('/patient-created', protect, authorize('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const records = await MedicalRecord.find({
      createdBy: 'patient'   // 👈 IMPORTANT: filter only patient-created records
    })
      .populate({
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (error) {
    console.error("Fetch patient-created records error:", error);
    res.status(500).json({ message: "Error fetching medical record" });
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get single medical record
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name specialization qualification' }
      })
      .populate('appointmentId');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Authorization
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && record.patientId._id.equals(patient._id)) ||
      (doctor && record.doctorId._id.equals(doctor._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, record });
  } catch (error) {
    console.error('Get Medical Record Error:', error);
    res.status(500).json({ message: 'Error fetching medical record' });
  }
});

router.get('/patient/:patientId/created-by-patient', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only this patient, doctor, or admin can see
    const loggedInPatient = await Patient.findOne({ userId: req.user._id });
    const allowed =
      req.user.role === "admin" ||
      req.user.role === "doctor" ||
      (loggedInPatient && loggedInPatient._id.toString() === patient._id.toString());

    if (!allowed) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const records = await MedicalRecord.find({
      patientId: req.params.patientId,
      createdBy: "patient"
    })
      .populate({
        path: "patientId",
        populate: { path: "userId", select: "name email" }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: records.length, records });

  } catch (err) {
    console.error("Get patient-created medical records error:", err);
    res.status(500).json({ message: "Error fetching patient-created records" });
  }
});

module.exports = router;