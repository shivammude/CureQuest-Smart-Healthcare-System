// src/pages/patient/CreateMedicalRecord.js
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import api from '../../utils/api'; // your axios instance

const CreateMedicalRecord = () => {
  const [historyText, setHistoryText] = useState('');
  const [loading, setLoading] = useState(false);
  // optional: select doctor (leave blank if not needed)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!historyText.trim()) {
      return toast.error('Please enter medical history / details');
    }
    try {
      setLoading(true);
      // payload matches patient-create endpoint expectation
      const payload = {
        diagnosis: 'Patient provided notes', // you can leave or compute
        notes: historyText,
        symptoms: [],          // optional
        vitalSigns: {},        // optional
      };

      // POST to patient medical-records route (adjust endpoint if different)
      const res = await api.post('/patient/medical-records', payload);
      if (res.data && res.data.success) {
        toast.success('Medical record submitted');
        setHistoryText('');
      } else {
        toast.success('Submitted (no confirmation from server)');
      }
    } catch (err) {
      console.error('CreateMedicalRecord submit error:', err);
      toast.error('Failed to submit medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Medical Records</h1>
        <p className="text-gray-600 mb-6">Medical History</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="medicalHistory" className="sr-only">Medical History</label>

          <textarea
            id="medicalHistory"
            value={historyText}
            onChange={(e) => setHistoryText(e.target.value)}
            placeholder="Type your medical history, symptoms, previous diagnoses, medications, or anything you'd like to share with your doctor. (Type N/A if there is not any medical history)"
            className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
          />

          {/* Optional: assign to doctor (if you want) */}
          {/* <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Doctor (optional)</label>
            <input
              type="text"
              value={assignedDoctorId}
              placeholder="Doctor ID (optional)"
              className="w-full p-2 border rounded"
            />
          </div> */}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg text-white ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            <button
              type="button"
              onClick={() => setHistoryText('')}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateMedicalRecord;
