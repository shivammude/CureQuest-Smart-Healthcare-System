// src/pages/doctor/Appointments.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  Pill
} from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format, isToday, isFuture, isPast } from 'date-fns';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch all appointments
  const fetchAppointments = useCallback(async () => {
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
  }, []);

  // Filter and sort appointments
  const filterAppointments = useCallback(() => {
    let filtered = [...appointments];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Date filter
    if (dateFilter === 'today') {
      filtered = filtered.filter(apt => isToday(new Date(apt.appointmentDate)));
    } else if (dateFilter === 'upcoming') {
      filtered = filtered.filter(apt => isFuture(new Date(apt.appointmentDate)));
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(apt => 
        isPast(new Date(apt.appointmentDate)) && !isToday(new Date(apt.appointmentDate))
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(apt =>
        (apt.patientId?.userId?.name?.toLowerCase().includes(term)) ||
        (apt.reasonForVisit?.toLowerCase().includes(term))
      );
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      if (dateA.getTime() === dateB.getTime()) {
        return a.timeSlot.localeCompare(b.timeSlot);
      }
      return dateA - dateB;
    });

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter, dateFilter, searchTerm]);

  // Re-run filter when dependencies change
  useEffect(() => {
    filterAppointments();
  }, [filterAppointments]);

  // Initial load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update appointment status
  const handleStatusUpdate = useCallback(async (appointmentId, newStatus) => {
    try {
      setUpdateLoading(true);
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });

      setAppointments(prev =>
        prev.map(apt =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      toast.success(`Appointment ${newStatus} successfully`);
      setShowModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to update appointment');
    } finally {
      setUpdateLoading(false);
    }
  }, []);

  // Add doctor's notes
  const handleAddNotes = useCallback(async (appointmentId, notes) => {
    try {
      await api.put(`/appointments/${appointmentId}`, { notes });

      setAppointments(prev =>
        prev.map(apt =>
          apt._id === appointmentId ? { ...apt, notes } : apt
        )
      );

      toast.success('Notes added successfully');
    } catch (error) {
      toast.error('Failed to add notes');
    }
  }, []);

  // Open modal
  const viewAppointmentDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedAppointment(null);
  }, []);

  // Status color helper
  const getStatusColor = useCallback((status) => {
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
  }, []);

  // Date badge (Today / Upcoming)
  const getDateBadge = useCallback((date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Today</span>;
    } else if (isFuture(appointmentDate)) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>;
    }
    return null;
  }, []);

  // Appointment Card Component
  const AppointmentCard = React.memo(({ appointment }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.patientId?.userId?.name || 'Unknown Patient'}
            </h3>
            <p className="text-sm text-gray-500">
              {appointment.patientId?.gender} • {appointment.patientId?.bloodGroup || 'N/A'}
            </p>
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
          {appointment.patientId?.userId?.phone || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          {appointment.patientId?.userId?.email || 'N/A'}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Reason for Visit:</p>
        <p className="text-sm text-gray-600">{appointment.reasonForVisit}</p>

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
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>

        <button
          onClick={() => viewAppointmentDetails(appointment)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  ));

  // Appointment Details Modal
  const AppointmentModal = React.memo(() => {
    const [notes, setNotes] = useState(selectedAppointment?.notes || '');

    if (!selectedAppointment) return null;

    const age = selectedAppointment.patientId?.dateOfBirth
      ? new Date().getFullYear() - new Date(selectedAppointment.patientId.dateOfBirth).getFullYear()
      : 'N/A';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-600">Name</p><p className="font-medium">{selectedAppointment.patientId?.userId?.name}</p></div>
                <div><p classEvent="text-gray-600">Age / Gender</p><p className="font-medium">{age} years / {selectedAppointment.patientId?.gender}</p></div>
                <div><p className="text-gray-600">Blood Group</p><p className="font-medium">{selectedAppointment.patientId?.bloodGroup || 'N/A'}</p></div>
                <div><p className="text-gray-600">Phone</p><p className="font-medium">{selectedAppointment.patientId?.userId?.phone}</p></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-medium">{format(new Date(selectedAppointment.appointmentDate), 'MMMM dd, yyyy')}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Time:</span><span className="font-medium">{selectedAppointment.timeSlot}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedAppointment.status)}`}>{selectedAppointment.status}</span></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Reason for Visit</h3>
              <p className="text-gray-700 text-sm">{selectedAppointment.reasonForVisit}</p>

              {selectedAppointment.symptoms?.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-900 mb-2">Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.symptoms.map((symptom, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">{symptom}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-900 mb-2">Doctor's Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add consultation notes..."
              />
              <button
                onClick={() => handleAddNotes(selectedAppointment._id, notes)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
              >
                Save Notes
              </button>
            </div>

            {selectedAppointment.status === 'scheduled' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed')}
                  disabled={updateLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Mark as Completed
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                  disabled={updateLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="h-5 w-5 mr-2" /> Cancel
                </button>
              </div>
            )}

            {selectedAppointment.status === 'completed' && (
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => window.location.href = `/doctor/medical-record/create?appointmentId=${selectedAppointment._id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" /> Create Medical Record
                </button>
                <button
                  onClick={() => window.location.href = `/doctor/prescription/create?appointmentId=${selectedAppointment._id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Pill className="h-4 w-4 mr-2" /> Create Prescription
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">Manage your patient appointments</p>
        </div>

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
                  placeholder="Search by patient name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
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
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
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
            className="mt-4 flex items-center px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

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
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You have no appointments scheduled'}
            </p>
          </div>
        )}

        {showModal && <AppointmentModal />}
      </div>
    </Layout>
  );
};

export default DoctorAppointments;