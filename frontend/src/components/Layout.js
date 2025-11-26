// src/components/Layout.js
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  Pill, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Activity,
  Settings,
  User,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
          { name: 'Patients', path: '/admin/patients', icon: User },
          { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
          { name: 'Profile', path: '/admin/profile', icon: Settings },
        ];
      
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: Home },
          { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
          { name: 'Patients', path: '/doctor/patients', icon: Users },
          { name: 'Medical Records', path: '/doctor/records', icon: FileText },
          { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
          { name: 'Profile', path: '/doctor/profile', icon: User },
        ];
      
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
          { name: 'Book Appointment', path: '/patient/book-appointment', icon: Calendar },
          { name: 'My Appointments', path: '/patient/appointments', icon: ClipboardList },
          { name: 'Medical Records', path: '/patient/medical-records', icon: FileText },
          { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
          { name: 'Profile', path: '/patient/profile', icon: User },
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">CureQuest</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:ml-0">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigationItems.find(item => isActive(item.path))?.name || 'Dashboard'}
            </h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2024 Smart Healthcare System. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-indigo-600">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-indigo-600">Terms of Service</Link>
              <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;