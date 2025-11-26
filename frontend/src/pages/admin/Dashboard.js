// src/pages/admin/Dashboard.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Stethoscope,
  TrendingUp,
  Activity,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/appointments')
      ]);

      const patients = patientsRes.data.patients || [];
      const doctors = doctorsRes.data.doctors || [];
      const appointments = appointmentsRes.data.appointments || [];

      // Calculate stats
      const today = new Date().setHours(0, 0, 0, 0);
      const todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).setHours(0, 0, 0, 0) === today
      );

      const completed = appointments.filter(apt => apt.status === 'completed');
      const cancelled = appointments.filter(apt => apt.status === 'cancelled');
      const pending = appointments.filter(apt => apt.status === 'scheduled');

      // Calculate revenue (sum of consultation fees from completed appointments)
      const revenue = completed.reduce((total, apt) => {
        return total + (apt.doctorId?.consultationFee || 0);
      }, 0);

      // Appointments by status for pie chart
      const statusData = [
        { name: 'Scheduled', value: pending.length, color: '#3B82F6' },
        { name: 'Completed', value: completed.length, color: '#10B981' },
        { name: 'Cancelled', value: cancelled.length, color: '#EF4444' }
      ];

      // Weekly appointments data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'MMM dd');
        const dayAppointments = appointments.filter(apt => 
          format(new Date(apt.appointmentDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        
        weeklyData.push({
          date: dateStr,
          appointments: dayAppointments.length,
          completed: dayAppointments.filter(a => a.status === 'completed').length,
          cancelled: dayAppointments.filter(a => a.status === 'cancelled').length
        });
      }

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments.length,
        completedAppointments: completed.length,
        cancelledAppointments: cancelled.length,
        pendingAppointments: pending.length,
        totalRevenue: revenue
      });

      setAppointmentsByStatus(statusData);
      setWeeklyStats(weeklyData);
      
      // Get recent appointments (last 5)
      const recent = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentAppointments(recent);

    } catch (error) {
      console.error('Dashboard Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening in your healthcare system today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3" /> Active users
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Doctors */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</p>
                <p className="text-xs text-blue-600 mt-1">
                  <UserCheck className="inline h-3 w-3" /> Available
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayAppointments}</p>
                <p className="text-xs text-purple-600 mt-1">
                  <Clock className="inline h-3 w-3" /> Scheduled today
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3" /> From consultations
                </p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pendingAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelledAppointments}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Appointments Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Appointments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#3B82F6" name="Total" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Appointments by Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Appointments by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Appointments</h3>
            <Link 
              to="/admin/appointments"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientId?.userId?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Dr. {appointment.doctorId?.userId?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.doctorId?.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.timeSlot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No recent appointments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <Users className="h-8 w-8 mb-2" />
              <p className="font-semibold">Manage Users</p>
              <p className="text-sm opacity-90">Add or Edit users</p>
            </Link>
            <Link
              to="/admin/appointments"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <Calendar className="h-8 w-8 mb-2" />
              <p className="font-semibold">View Appointments</p>
              <p className="text-sm opacity-90">Manage all appointments</p>
            </Link>
            <Link
              to="/admin/doctors"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all"
            >
              <Activity className="h-8 w-8 mb-2" />
              <p className="font-semibold">Manage Doctors</p>
              <p className="text-sm opacity-90">Add or Edit Doctors </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;