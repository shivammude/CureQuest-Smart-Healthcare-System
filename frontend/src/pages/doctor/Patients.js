// src/pages/doctor/Patients.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  Pill,
  AlertCircle,
  Filter,
  X,
  ChevronRight,
  Droplet,
  Users as UsersIcon
} from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [filterGender, setFilterGender] = useState('all');
  const [filterBloodGroup, setFilterBloodGroup] = useState('all');

  // Fetch all patients from appointments
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const appointmentsRes = await api.get('/appointments');
      const appointments = appointmentsRes.data.appointments || [];

      const uniquePatientsMap = new Map();
      appointments.forEach(apt => {
        const patient = apt.patientId;
        if (!patient) return;

        const id = patient._id;
        if (!uniquePatientsMap.has(id)) {
          uniquePatientsMap.set(id, {
            ...patient,
            lastVisit: apt.appointmentDate,
            totalAppointments: 1,
            appointments: [apt]
          });
        } else {
          const existing = uniquePatientsMap.get(id);
          existing.totalAppointments += 1;
          existing.appointments.push(apt);
          if (new Date(apt.appointmentDate) > new Date(existing.lastVisit)) {
            existing.lastVisit = apt.appointmentDate;
          }
        }
      });

      const patientsArray = Array.from(uniquePatientsMap.values());
      setPatients(patientsArray);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort patients
  const filterPatientsList = useCallback(() => {
    let filtered = [...patients];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => {
        const name = patient.userId?.name?.toLowerCase() || '';
        const email = patient.userId?.email?.toLowerCase() || '';
        const phone = patient.userId?.phone || '';
        return name.includes(term) || email.includes(term) || phone.includes(term);
      });
    }

    if (filterGender !== 'all') {
      filtered = filtered.filter(patient => patient.gender === filterGender);
    }

    if (filterBloodGroup !== 'all') {
      filtered = filtered.filter(patient => patient.bloodGroup === filterBloodGroup);
    }

    filtered.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    setFilteredPatients(filtered);
  }, [patients, searchTerm, filterGender, filterBloodGroup]);

  // Fetch patient details for modal
  const fetchPatientDetails = useCallback(async (patientId) => {
    try {
      setDetailsLoading(true);

      const [recordsRes, prescriptionsRes] = await Promise.all([
        api.get(`/medical-records/patient/${patientId}`),
        api.get(`/prescriptions/patient/${patientId}`)
      ]);

      const records = recordsRes.data.records || [];
      const prescriptions = prescriptionsRes.data.prescriptions || [];
      const patient = patients.find(p => p._id === patientId);

      setPatientDetails({
        ...patient,
        medicalRecords: records,
        prescriptions: prescriptions,
        appointments: patient.appointments || []
      });
    } catch (error) {
      console.error('Details Error:', error);
      toast.error('Failed to fetch patient details');
    } finally {
      setDetailsLoading(false);
    }
  }, [patients]);

  // View patient details
  const viewPatientDetails = useCallback(async (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
    await fetchPatientDetails(patient._id);
  }, [fetchPatientDetails]);

  // Calculate age from DOB
  const calculateAge = useCallback((dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Re-filter when dependencies change
  useEffect(() => {
    filterPatientsList();
  }, [filterPatientsList]);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPatient(null);
    setPatientDetails(null);
  }, []);

  // Patient Card Component
  const PatientCard = React.memo(({ patient }) => (
    <div
      onClick={() => viewPatientDetails(patient)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {patient.userId?.name || 'Unknown Patient'}
            </h3>
            <p className="text-sm text-gray-500">
              {calculateAge(patient.dateOfBirth)} years • {patient.gender}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          {patient.userId?.phone || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          {patient.userId?.email || 'N/A'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Droplet className="h-4 w-4 mr-2 text-gray-400" />
          Blood Group: <span className="font-semibold ml-1">{patient.bloodGroup || 'N/A'}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          Last Visit: {format(new Date(patient.lastVisit), 'MMM dd, yyyy')}
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
          {patient.totalAppointments} visits
        </span>
      </div>

      {patient.chronicConditions && patient.chronicConditions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {patient.chronicConditions.slice(0, 2).map((condition, idx) => (
            <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {condition}
            </span>
          ))}
          {patient.chronicConditions.length > 2 && (
            <span className="text-xs text-gray-500">+{patient.chronicConditions.length - 2} more</span>
          )}
        </div>
      )}
    </div>
  ));

  // Patient Modal Component
  const PatientModal = React.memo(() => {
    if (!selectedPatient || !patientDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedPatient.userId?.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Patient ID: {selectedPatient._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {detailsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Age</p>
                    <p className="text-lg font-semibold">{calculateAge(patientDetails.dateOfBirth)} years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-semibold capitalize">{patientDetails.gender}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Blood Group</p>
                    <p className="text-lg font-semibold">{patientDetails.bloodGroup || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p- loading-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Visits</p>
                    <p className="text-lg font-semibold">{patientDetails.totalAppointments}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">{patientDetails.userId?.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-gray-700">{patientDetails.userId?.email}</span>
                    </div>
                  </div>
                  {patientDetails.address && (
                    <div className="mt-3 text-sm text-gray-700">
                      <p className="font-medium">Address:</p>
                      <p>
                        {patientDetails.address.street}, {patientDetails.address.city}, 
                        {patientDetails.address.state} - {patientDetails.address.zipCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Health Alerts */}
                {(patientDetails.allergies?.length > 0 || patientDetails.chronicConditions?.length > 0) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      Health Alerts
                    </h3>
                    {patientDetails.allergies?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Allergies:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {patientDetails.allergies.map((allergy, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {patientDetails.chronicConditions?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Chronic Conditions:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {patientDetails.chronicConditions.map((condition, idx) => (
                            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Medical Records</p>
                        <p className="text-2xl font-bold text-gray-900">{patientDetails.medicalRecords.length}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Prescriptions</p>
                        <p className="text-2xl font-bold text-gray-900">{patientDetails.prescriptions.length}</p>
                      </div>
                      <Pill className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Appointments</p>
                        <p className="text-2xl font-bold text-gray-900">{patientDetails.appointments.length}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Medical Records */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Medical Records</h3>
                  {patientDetails.medicalRecords.length > 0 ? (
                    <div className="space-y-3">
                      {patientDetails.medicalRecords.slice(0, 3).map((record) => (
                        <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{record.diagnosis}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(record.visitDate), 'MMMM dd, yyyy')}
                              </p>
                            </div>
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          {record.symptoms && record.symptoms.length > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                              Symptoms: {record.symptoms.slice(0, 3).join(', ')}
                              {record.symptoms.length > 3 && '...'}
                            </p>
                          )}
                          {record.vitalSigns && (
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                              {record.vitalSigns.bloodPressure && (
                                <span>BP: {record.vitalSigns.bloodPressure}</span>
                              )}
                              {record.vitalSigns.heartRate && (
                                <span>HR: {record.vitalSigns.heartRate} bpm</span>
                              )}
                              {record.vitalSigns.temperature && (
                                <span>Temp: {record.vitalSigns.temperature}°F</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No medical records found</p>
                  )}
                </div>

                {/* Recent Prescriptions */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Prescriptions</h3>
                  {patientDetails.prescriptions.length > 0 ? (
                    <div className="space-y-3">
                      {patientDetails.prescriptions.slice(0, 3).map((prescription) => (
                        <div key={prescription._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-xs text-gray-500">
                                {format(new Date(prescription.prescriptionDate), 'MMMM dd, yyyy')}
                              </p>
                            </div>
                            <Pill className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Medications:</p>
                            <div className="space-y-1">
                              {prescription.medications.slice(0, 3).map((med, idx) => (
                                <p key={idx} className="text-sm text-gray-600">
                                  • {med.name} - {med.dosage} ({med.frequency})
                                </p>
                              ))}
                              {prescription.medications.length > 3 && (
                                <p className="text-xs text-gray-500">
                                  +{prescription.medications.length - 3} more medications
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No prescriptions found</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  });

  // Show loading state
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="mt-2 text-gray-600">View and manage your patient records</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-semibold text-gray-900">Search & Filter</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-600">
            <UsersIcon className="h-4 w-4 mr-2" />
            Showing {filteredPatients.length} of {patients.length} patients
          </div>
        </div>

        {/* Patients Grid */}
        {filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterGender !== 'all' || filterBloodGroup !== 'all'
                ? 'Try adjusting your filters'
                : 'You have no patients yet'}
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && <PatientModal />}
      </div>
    </Layout>
  );
};

export default DoctorPatients;