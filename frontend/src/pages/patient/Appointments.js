// src/pages/patient/Appointments.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Plus,
  RefreshCw,
  Search,
  DollarSign
} from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format, isToday, isFuture, isPast, isTomorrow } from 'date-fns';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments whenever relevant state changes
  const filterAppointments = useCallback(() => {
    let filtered = [...appointments];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Date filter
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(apt =>
        (isFuture(new Date(apt.appointmentDate)) || isToday(new Date(apt.appointmentDate))) &&
        apt.status === 'scheduled'
      );
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(apt =>
        isPast(new Date(apt.appointmentDate)) && !isToday(new Date(apt.appointmentDate))
      );
    } else if (dateFilter === 'today') {
      filtered = filtered.filter(apt => isToday(new Date(apt.appointmentDate)));
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(apt =>
        apt.doctorId?.userId?.name?.toLowerCase().includes(term) ||
        apt.doctorId?.specialization?.toLowerCase().includes(term) ||
        apt.reasonForVisit?.toLowerCase().includes(term)
      );
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, dateFilter, searchTerm]);

  // Re-run filter when dependencies change
  useEffect(() => {
    filterAppointments();
  }, [filterAppointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/appointments');
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);
      await api.delete(`/appointments/${selectedAppointment._id}`);

      setAppointments(prev =>
        prev.map(apt =>
          apt._id === selectedAppointment._id
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );

      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getDateBadge = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Today</span>;
    } else if (isTomorrow(appointmentDate)) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Tomorrow</span>;
    } else if (isFuture(appointmentDate)) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    }
    return null;
  };

  const canCancelAppointment = (appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    return appointment.status === 'scheduled' &&
           (isFuture(appointmentDate) || isToday(appointmentDate));
  };

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.doctorId?.userId?.name || 'Unknown Doctor'}
            </h3>
            <p className="text-sm text-gray-600">{appointment.doctorId?.specialization || 'General'}</p>
            <p className="text-xs text-gray-500 mt-1">{appointment.doctorId?.qualification}</p>
          </div>
        </div>
        {getDateBadge(appointment.appointmentDate)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {format(new Date(appointment.appointmentDate), 'EEEE, MMMM dd, yyyy')}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          {appointment.timeSlot}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {appointment.doctorId?.userId?.phone || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
          Consultation Fee: ₹{appointment.doctorId?.consultationFee || 0}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
        <p className="text-sm text-gray-600">{appointment.reasonForVisit || 'Not specified'}</p>

        {appointment.symptoms && appointment.symptoms.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {appointment.symptoms.map((symptom, index) => (
                <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {appointment.notes && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-1">Doctor's Notes:</p>
            <p className="text-sm text-blue-800">{appointment.notes}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(appointment.status)}`}>
          {getStatusIcon(appointment.status)}
          <span className="ml-1 capitalize">{appointment.status}</span>
        </span>

        {canCancelAppointment(appointment) && (
          <button
            onClick={() => {
              setSelectedAppointment(appointment);
              setShowCancelModal(true);
            }}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  const CancelModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Cancel Appointment</h3>
          </div>

          <p className="text-gray-700 mb-4">
            Are you sure you want to cancel your appointment with{' '}
            <span className="font-semibold">Dr. {selectedAppointment.doctorId?.userId?.name}</span>
            {' '}on {format(new Date(selectedAppointment.appointmentDate), 'MMMM dd, yyyy')} at{' '}
            {selectedAppointment.timeSlot}?
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800">
              Warning: Please cancel at least 24 hours in advance to avoid any cancellation fees.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={cancelLoading}
            >
              Keep Appointment
            </button>
            <button
              onClick={handleCancelAppointment}
              disabled={cancelLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="mt-2 text-gray-600">View and manage your appointments</p>
          </div>
          <Link
            to="/patient/book-appointment"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Book New
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Doctor name or specialization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchAppointments}
            className="mt-4 flex items-center px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 transition"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You haven't booked any appointments yet"}
            </p>
            <Link
              to="/patient/book-appointment"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Book Your First Appointment
            </Link>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && <CancelModal />}
      </div>
    </Layout>
  );
};

export default PatientAppointments;