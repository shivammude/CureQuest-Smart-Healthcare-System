// utils/notifications.js (Email-Only Version)
const nodemailer = require('nodemailer');

// Email Configuration (From your .env)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // If using TLS, set true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ------------------------------
// Generic Email Sending Function
// ------------------------------
const sendEmail = async ({ email, subject, html }) => {
  try {
    const mailOptions = {
      from: `Healthcare System <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------
// Appointment Confirmation Email (NO SMS)
// ---------------------------------------------------
const sendAppointmentConfirmation = async (appointment) => {
  try {
    const patientName = appointment.patientId.userId.name;
    const patientEmail = appointment.patientId.userId.email;
    const doctorName = appointment.doctorId.userId.name;
    const doctorSpecialization = appointment.doctorId.specialization;

    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const emailHtml = `
      <h2>Appointment Confirmed</h2>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>Your appointment has been confirmed.</p>

      <h3>Details:</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      <p><strong>Specialization:</strong> ${doctorSpecialization}</p>
      <p><strong>Date:</strong> ${appointmentDate}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>

      <br/>
      <p>Thank you!</p>
    `;

    await sendEmail({
      email: patientEmail,
      subject: "Appointment Confirmation - Smart Healthcare System",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Appointment Confirmation Error:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------
// Appointment Reminder Email (NO SMS)
// ---------------------------------------------------
const sendAppointmentReminder = async (appointment) => {
  try {
    const patientName = appointment.patientId.userId.name;
    const patientEmail = appointment.patientId.userId.email;
    const doctorName = appointment.doctorId.userId.name;

    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const emailHtml = `
      <h2>Appointment Reminder</h2>
      <p>Hello <strong>${patientName}</strong>,</p>
      <p>This is a reminder for your appointment scheduled tomorrow.</p>

      <h3>Details:</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      <p><strong>Date:</strong> ${appointmentDate}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>

      <br/>
      <p>Please arrive 10–15 minutes early.</p>
    `;

    await sendEmail({
      email: patientEmail,
      subject: "Appointment Reminder",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Appointment Reminder Error:", error);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------
// Prescription Notification Email (NO SMS)
// ---------------------------------------------------
const sendPrescriptionNotification = async (prescription) => {
  try {
    const patientEmail = prescription.patientId.userId.email;
    const doctorName = prescription.doctorId.userId.name;

    const emailHtml = `
      <h2>New Prescription Available</h2>
      <p>A new prescription has been uploaded by Dr. ${doctorName}.</p>
      <p>Please log into your patient dashboard to view or download it.</p>
    `;

    await sendEmail({
      email: patientEmail,
      subject: "New Prescription Added",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Prescription Notification Error:", error);
    return { success: false, error: error.message };
  }
};

// Export Only Email Functions
module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendPrescriptionNotification,
};
