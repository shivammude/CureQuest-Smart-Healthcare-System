const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },

  // NEW FIELD → doctor selected by patient
  assignedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },

  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },

  // NEW FIELD → tells who created the record
  createdBy: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'doctor'
  },

  visitDate: Date,
  diagnosis: String,
  symptoms: [String],

  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiration: Number
  },

  labResults: [
    {
      testName: String,
      result: String,
      normalRange: String
    }
  ],

  notes: String,
  followUpRequired: Boolean,
  followUpDate: Date

}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
