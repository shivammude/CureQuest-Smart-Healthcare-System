// routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');
const { sendAppointmentConfirmation, sendAppointmentReminder } = require('../utils/notifications');

// @route   POST /api/appointments
// @desc    Book new appointment
// @access  Private (Patient)
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reasonForVisit, symptoms } = req.body;

    // Get patient profile
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId).populate('userId');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reasonForVisit,
      symptoms: symptoms || [],
      status: 'scheduled'
    });

    // Populate for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    // Send confirmation notification
    await sendAppointmentConfirmation(populatedAppointment);

    res.status(201).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    const { status, date } = req.query;

    // Filter by role
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      query.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      query.doctorId = doctor._id;
    }

    // Additional filters
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ appointmentDate: 1, timeSlot: 1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('Get Appointments Error:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// @route GET /api/appointments/admin
// @desc Get all appointments (Admin only)
// @access Private
router.get('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const appointments = await Appointment.find()
  .populate({
    path: "patientId",
    populate: { path: "userId", select: "name email phone" }
  })
  .populate({
    path: "doctorId",
    populate: { path: "userId", select: "name email phone specialization" }
  })
  .sort({ appointmentDate: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Admin Appointment Fetch Error:", error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone specialization consultationFee' }
      });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization check
    const patient = await Patient.findOne({ userId: req.user._id });
    const doctor = await Doctor.findOne({ userId: req.user._id });

    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && appointment.patientId._id.equals(patient._id)) ||
      (doctor && appointment.doctorId._id.equals(doctor._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Get Appointment Error:', error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { status, notes, appointmentDate, timeSlot } = req.body;

    // Authorization and role-based updates
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (!appointment.doctorId.equals(doctor._id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Doctors can update status and notes
      if (status) appointment.status = status;
      if (notes) appointment.notes = notes;
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (!appointment.patientId.equals(patient._id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      // Patients can reschedule or cancel
      if (appointmentDate) appointment.appointmentDate = appointmentDate;
      if (timeSlot) appointment.timeSlot = timeSlot;
      if (status === 'cancelled') appointment.status = 'cancelled';
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    res.json({ success: true, appointment: updatedAppointment });
  } catch (error) {
    console.error('Update Appointment Error:', error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    const patient = await Patient.findOne({ userId: req.user._id });
    const isAuthorized = 
      req.user.role === 'admin' ||
      (patient && appointment.patientId.equals(patient._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel Appointment Error:', error);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

// @route   GET /api/appointments/doctor/:doctorId/available-slots
// @desc    Get available time slots for a doctor
// @access  Public
router.get('/doctor/:doctorId/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get booked appointments for the date
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const bookedAppointments = await Appointment.find({
      doctorId: req.params.doctorId,
      appointmentDate: { $gte: startDate, $lt: endDate },
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Generate available slots (example: 30-min slots from 9 AM to 5 PM)
    const allSlots = generateTimeSlots('09:00', '17:00', 30);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ success: true, availableSlots, bookedSlots });
  } catch (error) {
    console.error('Get Available Slots Error:', error);
    res.status(500).json({ message: 'Error fetching available slots' });
  }
});

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  let [startHour, startMin] = startTime.split(':').map(Number);
  let [endHour, endMin] = endTime.split(':').map(Number);
  
  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  
  while (current < end) {
    const hour = Math.floor(current / 60);
    const min = current % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    current += intervalMinutes;
  }
  
  return slots;
}

// @route   GET /api/appointments/patient/:patientId
// @desc    Get all appointments for a specific patient
// @access  Private
router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const { patientId } = req.params;

    const query = { patientId };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'specialization userId')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .sort({ appointmentDate: 1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Fetch patient appointments error:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});



module.exports = router;