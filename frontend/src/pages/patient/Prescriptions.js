// src/pages/patient/Prescriptions.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Pill,
  User,
  Calendar,
  FileText,
  Eye,
  Search,
  Filter,
  X,
  AlertCircle,
  ChevronRight,
  Printer
} from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PatientPrescriptions = () => {
  const { user } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterYear, setFilterYear] = useState('all');

  // Wrap fetchPrescriptions in useCallback to satisfy exhaustive-deps
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/prescriptions/patient/${user.patientInfo._id}`);
      setPrescriptions(data.prescriptions || []);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  }, [user.patientInfo._id]);

  // Wrap filter function in useCallback
  const filterPrescriptionsList = useCallback(() => {
    let filtered = [...prescriptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(prescription =>
        prescription.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medications?.some(med => 
          med.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(prescription => 
        new Date(prescription.prescriptionDate).getFullYear().toString() === filterYear
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate));

    setFilteredPrescriptions(filtered);
  }, [prescriptions, searchTerm, filterYear]);

  // Now safe: dependencies are properly declared
  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  useEffect(() => {
    filterPrescriptionsList();
  }, [filterPrescriptionsList]);

  const viewPrescriptionDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const getAvailableYears = () => {
    const years = new Set(prescriptions.map(prescription => 
      new Date(prescription.prescriptionDate).getFullYear().toString()
    ));
    return Array.from(years).sort((a, b) => b - a);
  };

  const PrescriptionCard = ({ prescription }) => (
    <div 
      onClick={() => viewPrescriptionDetails(prescription)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <div className="bg-purple-100 p-3 rounded-full">
            <Pill className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Prescription #{prescription._id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {prescription.doctorId?.userId?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {prescription.doctorId?.specialization}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          {format(new Date(prescription.prescriptionDate), 'MMMM dd, yyyy')}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Pill className="h-4 w-4 mr-2 text-gray-400" />
          {prescription.medications?.length || 0} Medication{prescription.medications?.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Medications:</p>
        <div className="space-y-1">
          {prescription.medications?.slice(0, 2).map((med, idx) => (
            <p key={idx} className="text-sm text-gray-600 truncate">
              • {med.name} - {med.dosage}
            </p>
          ))}
          {prescription.medications?.length > 2 && (
            <p className="text-xs text-gray-500">+{prescription.medications.length - 2} more medications</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            viewPrescriptionDetails(prescription);
          }}
          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        
      </div>
    </div>
  );

  const PrescriptionModal = () => {
    if (!selectedPrescription) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Pill className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Medical Prescription</h2>
                  <p className="text-sm text-gray-600">
                    Issued on {format(new Date(selectedPrescription.prescriptionDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPrescription(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6" id="prescription-content">
            {/* All modal content remains EXACTLY the same */}
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-600">Prescription ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {selectedPrescription._id.toUpperCase()}
              </p>
            </div>

            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 text-indigo-600 mr-2" />
                Prescribed By
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Doctor Name</p>
                  <p className="font-medium">Dr. {selectedPrescription.doctorId?.userId?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Specialization</p>
                  <p className="font-medium">{selectedPrescription.doctorId?.specialization}</p>
                </div>
                <div>
                  <p className="text-gray-600">Qualification</p>
                  <p className="font-medium">{selectedPrescription.doctorId?.qualification}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date Issued</p>
                  <p className="font-medium">
                    {format(new Date(selectedPrescription.prescriptionDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Patient Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Patient ID</p>
                  <p className="font-medium">{user.patientInfo?._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className="text-6xl font-serif text-indigo-600">Rx</div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Pill className="h-5 w-5 text-purple-600 mr-2" />
                Prescribed Medications
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Medicine Name</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Dosage</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Frequency</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrescription.medications?.map((med, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">{med.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{med.dosage}</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{med.frequency}</td>
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedPrescription.medications?.some(med => med.instructions) && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  Instructions
                </h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedPrescription.medications
                      ?.filter(med => med.instructions)
                      .map((med, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          <span className="font-medium">{med.name}:</span> {med.instructions}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedPrescription.advice && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 text-green-600 mr-2" />
                  Doctor's Advice
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedPrescription.advice}
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Important Notes
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-800">
                <li>Take medications as prescribed by your doctor</li>
                <li>Complete the full course even if you feel better</li>
                <li>Store medications in a cool, dry place</li>
                <li>Keep out of reach of children</li>
                <li>Consult your doctor if you experience any side effects</li>
              </ul>
            </div>

            <div className="border-t border-gray-300 pt-6">
              <div className="flex justify-between items-end">
                <div className="text-sm text-gray-600">
                  <p>This is a digitally generated prescription</p>
                  <p className="text-xs mt-1">
                    Date: {format(new Date(selectedPrescription.prescriptionDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-2 font-serif text-2xl text-indigo-600">
                    {selectedPrescription.doctorId?.userId?.name}
                  </div>
                  <div className="border-t-2 border-gray-800 pt-1">
                    <p className="text-sm font-medium">Doctor's Signature</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Printer className="h-5 w-5 mr-2" />
                Print
              </button>
            </div>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="mt-2 text-gray-600">
            View and download your medical prescriptions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
              <Pill className="h-12 w-12 text-purple-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Year</p>
                <p className="text-3xl font-bold text-green-600">
                  {prescriptions.filter(p => 
                    new Date(p.prescriptionDate).getFullYear() === new Date().getFullYear()
                  ).length}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medications</p>
                <p className="text-3xl font-bold text-blue-600">
                  {prescriptions.reduce((total, p) => total + (p.medications?.length || 0), 0)}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-semibold text-gray-900">Search & Filter</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Doctor name or medication..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              >
            <option value="all">All Years</option>

            {/* Manually added years */}
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>

            {/* Dynamically loaded years */}
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
              </select>
            </div>
          </div>
        </div>

        {filteredPrescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard key={prescription._id} prescription={prescription} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Prescriptions Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterYear !== 'all'
                ? 'Try adjusting your filters'
                : 'Your prescriptions will appear here after doctor consultations'}
            </p>
          </div>
        )}

        {showModal && <PrescriptionModal />}
      </div>
    </Layout>
  );
};

export default PatientPrescriptions;