// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import HealthcareUIPreview from './components/HealthcareUIPreview';
import LandingPage from "./components/LandingPage";

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientDashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import BookAppointment from './pages/patient/BookAppointment';
import MedicalRecords from './pages/patient/CreateMedicalRecord';
import Prescriptions from './pages/patient/Prescriptions';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PatientProfile from './pages/patient/Profile';
import DoctorProfile from "./pages/doctor/Profile";
import PrescriptionCreate from "./pages/doctor/PrescriptionCreate";
import DoctorMedicalRecords from './pages/doctor/PatientProvidedRecords';
import CreateMedicalRecord from './pages/patient/CreateMedicalRecord';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import DoctorPatientProvidedRecords from './pages/doctor/PatientProvidedRecords';
import AdminProfile from "./pages/admin/Profile";
import AdminPatients from './pages/admin/Patients';
import AdminDoctors from './pages/admin/Doctors';
import AdminUsers from './pages/admin/Users';
import AdminAppointments from './pages/admin/Appointments';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- HomeRouter: single place to decide whether to show LandingPage or redirect to role home ---
// This replaces the previous duplicate "/" routes which caused other public routes to not load.
const HomeRouter = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <LandingPage />;

  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    default:
      return <LandingPage />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ui-preview" element={<HealthcareUIPreview />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/medical-records" element={<DoctorMedicalRecords />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />

            {/* Home (decides landing vs role-home) */}
            <Route path="/" element={<HomeRouter />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAppointments />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <PrescriptionCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/records"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorMedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient-records"
              element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPatientProvidedRecords />
              </ProtectedRoute>
              }
            />
            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/medical-records"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/medical-records/create"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <CreateMedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/prescriptions"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Prescriptions />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
