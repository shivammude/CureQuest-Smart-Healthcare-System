# 🏥 Smart Healthcare Appointment and Record System - CureQuest

A comprehensive full-stack healthcare management system built with the MERN stack that enables efficient appointment scheduling, medical record management, and prescription generation for clinics and small hospitals.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Patients
- 👤 **User Registration & Authentication** - Secure sign-up with JWT tokens
- 📅 **Book Appointments** - Easy 3-step appointment booking process
- 🔍 **Search Doctors** - Find doctors by specialization
- 📊 **View Medical Records** - Access complete medical history
- 💊 **Prescriptions** - Download and view prescriptions as PDF
- 🔔 **Notifications** - SMS and Email reminders for appointments
- 📱 **Dashboard** - Personalized dashboard with health overview

### For Doctors
- 🗓️ **Manage Appointments** - View, accept, and manage patient appointments
- 📝 **Create Medical Records** - Document patient visits and diagnosis
- 💉 **Generate Prescriptions** - Digital prescription creation with PDF export
- 👥 **Patient Management** - Access patient history and records
- 📈 **Analytics** - Track appointments and consultations

### For Admins
- 🔐 **User Management** - Manage doctors, patients, and staff
- 📊 **System Overview** - Monitor system usage and statistics
- ⚙️ **Configuration** - System settings and management

### Core Functionality
- 🔒 **Role-Based Access Control** - Three user roles (Admin, Doctor, Patient)
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📧 **Email Notifications** - Appointment confirmations and reminders
- 📄 **PDF Generation** - Downloadable prescriptions and reports
- 🕐 **Real-time Slot Management** - Check available appointment slots
- 🔍 **Search & Filter** - Advanced search for doctors and appointments

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building user interfaces
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **jsPDF & html2canvas** - PDF generation
- **date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **Express Validator** - Input validation

## 🏗️ System Architecture

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTPS/REST API
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴───┬──────┬
    │        │      |            
┌───▼───┐ ┌──▼──┐ ┌──▼──┐
│MongoDB│ │Email│ │ JWT │
│  DB   │ │SMTP │ │ Auth│  
└───────┘ └─────┘ └─────┘
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/healthcare-system.git
cd healthcare-system
```

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Step 4: Database Setup
```bash
# Start MongoDB
sudo systemctl start mongod

# (Optional) Seed database with demo data
cd ../backend
node seed.js
```

### Step 5: Run the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/healthcare

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Gmail Setup for Email Notifications

1. Enable 2-Factor Authentication in your Google Account
2. Generate App Password:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Scroll to "App passwords"
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## 🚀 Usage

### Demo Credentials

After seeding the database, use these credentials to test:

| Role    | Email             | Password    |
|---------|-------------------|-------------|
| Admin   | admin@demo.com    | password123 |
| Doctor  | doctor@demo.com   | password123 |
| Patient | patient@demo.com  | password123 |

### User Workflows

#### Patient Workflow
1. Register/Login as a patient
2. Browse available doctors
3. Book an appointment (select doctor, date, time)
4. Receive email/SMS confirmation
5. View upcoming appointments on dashboard
6. Access medical records and prescriptions

#### Doctor Workflow
1. Login as a doctor
2. View scheduled appointments
3. Mark appointments as completed
4. Create medical records for patients
5. Generate prescriptions
6. Access patient history

#### Admin Workflow
1. Login as admin
2. Manage users (doctors, patients)
3. View system statistics
4. Configure system settings

## 📚 API Documentation

### Authentication

**POST** `/api/auth/register` - Register new user  
**POST** `/api/auth/login` - Login user  
**GET** `/api/auth/me` - Get current user

### Appointments

**POST** `/api/appointments` - Book appointment  
**GET** `/api/appointments` - Get all appointments  
**GET** `/api/appointments/:id` - Get single appointment  
**PUT** `/api/appointments/:id` - Update appointment  
**DELETE** `/api/appointments/:id` - Cancel appointment  
**GET** `/api/appointments/doctor/:doctorId/available-slots` - Get available slots

### Medical Records

**POST** `/api/medical-records` - Create medical record (Doctor only)  
**GET** `/api/medical-records/patient/:patientId` - Get patient records  
**GET** `/api/medical-records/:id` - Get single record

### Prescriptions

**POST** `/api/prescriptions` - Create prescription (Doctor only)  
**GET** `/api/prescriptions/patient/:patientId` - Get patient prescriptions  
**GET** `/api/prescriptions/:id` - Get single prescription  
**GET** `/api/prescriptions/:id/pdf` - Generate PDF

### Doctors

**GET** `/api/doctors` - Get all doctors  
**GET** `/api/doctors/:id` - Get single doctor

### Patients

**GET** `/api/patients` - Get all patients (Doctor/Admin only)

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 📁 Project Structure

```
healthcare-system/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   └── Prescription.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── doctors.js
│   │   ├── patients.js
│   │   ├── medicalRecords.js
│   │   └── prescriptions.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── utils/               # Utility functions
│   │   └── notifications.js
│   ├── server.js            # Express app
│   ├── seed.js              # Database seeder
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
|   |    |— favicon.ico
|   |    |— index.html
|   |    |— manifest.json
|   |    |— robots.txt
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   └── patient/
│   │   ├── store/           # Zustand stores
│   │   │   └── authStore.js
│   │   ├── utils/           # Utility functions
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
|   |   |__ index.css
│   ├── package.json
│   └── .env
│── docker-compose.yml
|
└── README.md
```

## 🖼️ Screenshots
### Landing Page, Login Page and Registration Page
Advanced login system and reset password system.

![Get Started](https://github.com/shivammude/CureQuest-Smart-Healthcare-System/blob/master/Get%20Started%20Page.png)

### Patient Dashboard
Dashboard showing upcoming appointments and health overview.

### Book Appointment
Three-step process: Select Doctor → Choose Date/Time → Confirm Details

### Prescription Generator
Digital prescription with medication details and doctor's advice.

### Medical Records
Complete patient medical history with diagnoses and treatments.

## 🧪 Testing

### Manual Testing
1. Register as a patient and book appointments
2. Login as doctor and manage appointments
3. Create medical records and prescriptions
4. Test email/SMS notifications

### API Testing with Postman
```bash
# Import the Postman collection (if provided)
# Test all endpoints with different user roles
```

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)

```bash
# Example with Heroku
heroku create healthcare-backend
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Using Vercel
npm i -g vercel
cd frontend
vercel --prod
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for database
- [ ] Configure CORS for production URLs
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT secret
- [ ] Configure real email/SMS services
- [ ] Set up error monitoring (Sentry)
- [ ] Enable rate limiting
- [ ] Set up automated backups

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint for code linting
- Follow Airbnb JavaScript style guide
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## 🐛 Known Issues

- Email sending may fail without proper Gmail app password
- PDF generation works best on modern browsers

## 📝 Future Enhancements

- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video consultation feature
- [ ] Mobile app (React Native)
- [ ] Lab reports upload
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Real-time notifications (Socket.io)
- [ ] Health tracking and vitals monitoring
- [ ] Export medical records as PDF

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Shivam Mude - Initial work - [YourGitHub](https://github.com/shivammude)

## 🙏 Acknowledgments

- Inspired by modern healthcare management systems
- Built for solving coordination issues in small clinics
- Thanks to the open-source community

## 📞 Support

For support, email support@yourdomain.com or create an issue in the repository.

## 🔗 Links

- [API Documentation](https://your-api-docs.com)
- [Project Board](https://github.com/shivammude/CureQuest-Smart-Healthcare-System)

---

**Made with ❤️ for better healthcare management**


⭐ Star this repo if you find it helpful!


