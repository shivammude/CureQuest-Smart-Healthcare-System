// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('role').isIn(['patient', 'doctor']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, phone, role, additionalInfo } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        additionalInfo,
      });

      let extraInfo = {};

      // Create role-specific profile
      if (role === 'patient' && additionalInfo) {
        const patient = await Patient.create({
          userId: user._id,
          dateOfBirth: additionalInfo.dateOfBirth,
          gender: additionalInfo.gender,
          bloodGroup: additionalInfo.bloodGroup,
          address: additionalInfo.address,
        });
        extraInfo.patientInfo = patient;
      } else if (role === 'doctor' && additionalInfo) {
        const doctor = await Doctor.create({
          userId: user._id,
          specialization: additionalInfo.specialization,
          qualification: additionalInfo.qualification,
          experience: additionalInfo.experience,
          consultationFee: additionalInfo.consultationFee,
          availableSlots: additionalInfo.availableSlots,
        });
        extraInfo.doctorInfo = doctor;
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          ...extraInfo,
        },
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      // Add patientInfo / doctorInfo to response
      let extraInfo = {};
      if (user.role === 'patient') {
        const patient = await Patient.findOne({ userId: user._id });
        if (patient) extraInfo.patientInfo = patient;
      } else if (user.role === 'doctor') {
        const doctor = await Doctor.findOne({ userId: user._id });
        if (doctor) extraInfo.doctorInfo = doctor;
      }

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          ...extraInfo,
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    let userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      profileImage: req.user.profileImage,
    };

    // Get role-specific data
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user._id });
      if (patient) {
        userData.patientInfo = patient;
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user._id });
      if (doctor) {
        userData.doctorInfo = doctor;
      }
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "No account found with this email" });
      }

      // Generate token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash token before saving in DB
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
      await user.save({ validateBeforeSave: false });

      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // ✅ Configure email transport (Gmail or custom SMTP)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER, // your Gmail ID
          pass: process.env.SMTP_PASS, // your Gmail App Password
        },
      });

      const mailOptions = {
        from: `"CureQuest Support" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request - CureQuest",
        html: `
          <h3>Hi ${user.name},</h3>
          <p>You recently requested to reset your password for your CureQuest account.</p>
          <p>Click the link below to reset your password (valid for 10 minutes):</p>
          <a href="${resetURL}" target="_blank">${resetURL}</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <br/>
          <p>— The CureQuest Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        message: "Password reset email sent successfully!",
      });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ message: "Server error while sending reset email" });
    }
  }
);

router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.json({ success: true, message: "Password reset successful!" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Server error while resetting password" });
    }
  }
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile (name, email, phone)
// @access  Private
router.put("/update-profile", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    // Return updated user
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

module.exports = router;