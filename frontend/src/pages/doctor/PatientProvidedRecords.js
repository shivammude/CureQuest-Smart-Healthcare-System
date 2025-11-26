// src/pages/doctor/PatientProvidedRecords.js
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Search, X } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

const DoctorPatientProvidedRecords = () => {
  useAuthStore();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPatientCreatedRecords = useCallback(async () => {
    try {
      setLoading(true);
      // EXPECTS backend endpoint that returns records created BY PATIENTS relevant to this doctor
      const { data } = await api.get('/medical-records/patient-created');
      setRecords(data.records || []);
    } catch (err) {
      console.error('Fetch patient-created records error:', err);
      toast.error('Failed to load patient-submitted records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatientCreatedRecords();
  }, [fetchPatientCreatedRecords]);

  const filtered = records.filter(r => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const title = (r.title || r.diagnosis || 'Patient provided notes').toLowerCase();
    const notes = (r.notes || '').toLowerCase();
    const patientName = (r.patientId?.userId?.name || '').toLowerCase();
    return title.includes(q) || notes.includes(q) || patientName.includes(q);
  });

  const open = (record) => {
    setSelected(record);
    setShowModal(true);
  };
  const close = () => {
    setSelected(null);
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Patient Medical History</h1>
          <p className="mt-2 text-gray-600">
            Have a look at personal notes submitted directly by your patients, each clearly dated for precise chronological context.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, notes or patient..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="ml-4 text-sm text-gray-600">
              {loading ? 'Loading…' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patient-submitted records</h3>
            <p className="text-gray-600">Patients have not submitted any notes yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(record => {
              const title = record.title || record.diagnosis || 'Patient provided notes';
              const short = record.notes ? (record.notes.length > 120 ? record.notes.slice(0, 117) + '...' : record.notes) : 'No details provided';
              return (
                <div
                  key={record._id}
                  onClick={() => open(record)}
                  className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{short}</p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>{format(new Date(record.createdAt || record.visitDate || Date.now()), 'MMM dd, yyyy')}</div>
                      <div className="mt-2 text-gray-400">{record.patientId?.userId?.name || 'Unknown patient'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-40" onClick={close} />
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg z-10">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selected.title || selected.diagnosis || 'Patient provided notes'}</h2>
                  <p className="text-sm text-gray-500">
                    {selected.patientId?.userId?.name || 'Unknown patient'} • {format(new Date(selected.createdAt || selected.visitDate || Date.now()), 'EEEE, MMM dd, yyyy')}
                  </p>
                </div>
                <button onClick={close} className="text-gray-500 hover:text-gray-700 p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                <div className="prose max-w-none">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.notes || 'No notes provided.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorPatientProvidedRecords;
