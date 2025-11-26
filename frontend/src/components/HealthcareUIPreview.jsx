import { useState } from 'react';
import { 
  Calendar, Users, FileText, Pill, Activity, User, LogOut, 
  Heart, Clock, CheckCircle, Mail, Search,
  TrendingUp, Star, Eye, Download
} from 'lucide-react';

const HealthcareUIPreview = () => {
  const [activeView, setActiveView] = useState('login');
  const [userRole, setUserRole] = useState('patient');

  // Login Screen
  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Smart Healthcare System
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <button
              onClick={() => setActiveView('dashboard')}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setActiveView('register')}
              className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50"
            >
              Create new account
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-900 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-amber-800">
            <p><strong>Patient:</strong> patient@demo.com / password123</p>
            <p><strong>Doctor:</strong> doctor@demo.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Register Screen
  const RegisterScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full border border-gray-300 rounded-md p-2" />
            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-md p-2" />
            <input type="tel" placeholder="Phone" className="w-full border border-gray-300 rounded-md p-2" />
            <input type="password" placeholder="Password" className="w-full border border-gray-300 rounded-md p-2" />
            
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Register as Patient</option>
              <option>Register as Doctor</option>
            </select>

            <button
              onClick={() => setActiveView('login')}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Register
            </button>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => setActiveView('login')} className="text-sm text-indigo-600">
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Patient Dashboard
  const PatientDashboard = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h1>
      <p className="text-gray-600 mb-8">Here's an overview of your health information</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medical Records</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Pill className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          <button className="text-indigo-600 text-sm font-medium">Book New</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">Dr. Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Cardiologist</p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Today</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                Dec 15, 2024
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                10:00 AM
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700">
          <Calendar className="h-6 w-6 mb-2 mx-auto" />
          <p className="text-sm">Book Appointment</p>
        </button>
        <button className="bg-white border text-gray-700 p-4 rounded-lg hover:bg-gray-50">
          <FileText className="h-6 w-6 mb-2 mx-auto" />
          <p className="text-sm">Medical Records</p>
        </button>
        <button className="bg-white border text-gray-700 p-4 rounded-lg hover:bg-gray-50">
          <Pill className="h-6 w-6 mb-2 mx-auto" />
          <p className="text-sm">Prescriptions</p>
        </button>
        <button className="bg-white border text-gray-700 p-4 rounded-lg hover:bg-gray-50">
          <User className="h-6 w-6 mb-2 mx-auto" />
          <p className="text-sm">Profile</p>
        </button>
      </div>
    </div>
  );

  // Doctor Dashboard
  const DoctorDashboard = () => (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. Sarah! 👨‍⚕️</h1>
      <p className="text-gray-600 mb-8">Here's your practice overview for today</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <TrendingUp className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Today's Appointments</p>
          <p className="text-4xl font-bold">8</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8" />
            <CheckCircle className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">This Week</p>
          <p className="text-4xl font-bold">35</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <Star className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Patients</p>
          <p className="text-4xl font-bold">142</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Pill className="h-8 w-8" />
            <FileText className="h-6 w-6 opacity-80" />
          </div>
          <p className="text-sm opacity-90 mb-1">Prescriptions</p>
          <p className="text-4xl font-bold">89</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
        
        <div className="space-y-4">
          {[
            { name: 'John Doe', time: '09:00 AM', reason: 'Regular checkup', status: 'scheduled' },
            { name: 'Jane Smith', time: '10:30 AM', reason: 'Follow-up', status: 'completed' },
            { name: 'Mike Johnson', time: '02:00 PM', reason: 'Consultation', status: 'scheduled' }
          ].map((apt, i) => (
            <div key={i} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{apt.name}</p>
                  <p className="text-sm text-gray-600">{apt.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{apt.time}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Book Appointment View
  const BookAppointmentView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Select a Doctor</h3>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Dr. Sarah Johnson', spec: 'Cardiologist', exp: '10 years', fee: 500, rating: 4.8 },
            { name: 'Dr. Michael Chen', spec: 'Neurologist', exp: '8 years', fee: 600, rating: 4.9 },
            { name: 'Dr. Emily Brown', spec: 'Pediatrician', exp: '12 years', fee: 450, rating: 4.7 }
          ].map((doc, i) => (
            <div key={i} className="border rounded-lg p-4 hover:border-indigo-300 cursor-pointer">
              <div className="flex items-start mb-3">
                <div className="bg-indigo-100 p-3 rounded-full mr-3">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.spec}</p>
                  <p className="text-xs text-gray-500">{doc.exp} experience</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {doc.rating}
                </div>
                <span className="text-sm font-medium text-indigo-600">₹{doc.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Prescriptions View
  const PrescriptionsView = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Prescriptions</p>
              <p className="text-3xl font-bold">15</p>
            </div>
            <Pill className="h-12 w-12 text-purple-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">Prescription #{i}23456</h3>
                <p className="text-sm text-gray-600 mt-1">Dr. Sarah Johnson</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Dec 10, 2024
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Pill className="h-4 w-4 mr-2" />
                3 Medications
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button className="flex-1 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center">
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Main Layout with Sidebar
  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold">Healthcare</span>
        </div>

        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">
                {userRole === 'patient' ? 'John Doe' : 'Dr. Sarah Johnson'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { icon: Activity, label: 'Dashboard', view: 'dashboard' },
            { icon: Calendar, label: userRole === 'patient' ? 'Book Appointment' : 'Appointments', view: 'book' },
            { icon: FileText, label: 'Medical Records', view: 'records' },
            { icon: Pill, label: 'Prescriptions', view: 'prescriptions' },
            { icon: Users, label: userRole === 'doctor' ? 'Patients' : 'Profile', view: 'profile' }
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <item.icon className="h-5 w-5 mr-3 text-gray-400" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={() => setActiveView('login')}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {activeView === 'dashboard' ? 'Dashboard' : 
             activeView === 'book' ? 'Book Appointment' :
             activeView === 'prescriptions' ? 'Prescriptions' :
             activeView === 'records' ? 'Medical Records' : 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                {userRole === 'patient' ? 'John Doe' : 'Dr. Sarah Johnson'}
              </p>
              <p className="text-xs text-gray-500">
                {userRole === 'patient' ? 'patient@demo.com' : 'doctor@demo.com'}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen overflow-auto">
      {/* View Selector */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('login')}
            className={`px-4 py-2 rounded ${activeView === 'login' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveView('register')}
            className={`px-4 py-2 rounded ${activeView === 'register' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Register
          </button>
          <button
            onClick={() => { setActiveView('dashboard'); setUserRole('patient'); }}
            className={`px-4 py-2 rounded ${activeView !== 'login' && activeView !== 'register' && userRole === 'patient' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Patient View
          </button>
          <button
            onClick={() => { setActiveView('dashboard'); setUserRole('doctor'); }}
            className={`px-4 py-2 rounded ${activeView !== 'login' && activeView !== 'register' && userRole === 'doctor' ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            Doctor View
          </button>
        </div>
        <p className="text-sm">Click buttons to switch between views</p>
      </div>

      {/* Content */}
      {activeView === 'login' && <LoginScreen />}
      {activeView === 'register' && <RegisterScreen />}
      {activeView !== 'login' && activeView !== 'register' && (
        <DashboardLayout>
          {activeView === 'dashboard' && (userRole === 'patient' ? <PatientDashboard /> : <DoctorDashboard />)}
          {activeView === 'book' && <BookAppointmentView />}
          {activeView === 'prescriptions' && <PrescriptionsView />}
          {activeView === 'records' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Medical Records</h1>
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Medical records view with diagnosis, vital signs, and lab results</p>
              </div>
            </div>
          )}
        </DashboardLayout>
      )}
    </div>
  );
};

export default HealthcareUIPreview;