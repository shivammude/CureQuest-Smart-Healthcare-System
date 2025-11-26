// src/pages/patient/BookAppointment.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Search, ArrowLeft, User, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { format, addDays } from 'date-fns';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reasonForVisit: '',
    symptoms: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(doctor =>
        doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors || []);
      setFilteredDoctors(data.doctors || []);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const { data } = await api.get(
        `/appointments/doctor/${selectedDoctor._id}/available-slots`,
        { params: { date: selectedDate } }
      );
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reasonForVisit: formData.reasonForVisit,
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s),
      };

      await api.post('/appointments', appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/patient/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Book Appointment</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Doctor</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'} transition-all`} />
          </div>
          <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Date & Time</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'} transition-all`} />
          </div>
          <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Select a Doctor</h2>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Dr. {doctor.userId.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {doctor.specialization}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {doctor.qualification}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                        </div>
                        <span className="text-sm font-medium text-indigo-600">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {doctor.experience} years experience
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No doctors found matching your search
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Selected Doctor</h2>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Dr. {selectedDoctor.userId.name}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Select Date</h2>
            <div className="grid grid-cols-7 gap-2 mb-6">
              {getNextDays().map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isSelected = selectedDate === dateStr;
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateSelect(dateStr)}
                    className={`p-3 rounded-lg text-center border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-xs text-gray-600">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(day, 'dd')}
                    </div>
                    <div className="text-xs text-gray-600">
                      {format(day, 'MMM')}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <>
                <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSlot === slot
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        <div className="text-sm font-medium">{slot}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No available slots for this date
                  </div>
                )}
              </>
            )}

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Details */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            
            {/* Summary */}
            <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">Dr. {selectedDoctor.userId.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialization:</span>
                <span className="font-medium">{selectedDoctor.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{format(new Date(selectedDate), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedSlot}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-semibold text-lg">₹{selectedDoctor.consultationFee}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit *
                </label>
                <textarea
                  required
                  value={formData.reasonForVisit}
                  onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe your health concern..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., fever, headache, cough"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;