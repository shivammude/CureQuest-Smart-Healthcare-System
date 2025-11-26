// src/pages/patient/Profile.js
import React from 'react';
import { User, Mail, Phone, Calendar, Heart, Droplet, Activity, Edit3, AlertTriangle, Pill } from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../store/authStore';

const PatientProfile = () => {
  const { user } = useAuthStore();

  // Mock patient data — you can replace this later with API data
  const patient = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+91 9876543210',
    gender: 'Male',
    dob: '1995-06-12',
    bloodGroup: 'O+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Peanuts', 'Dust'],
    chronicConditions: ['Hypertension'],
    medications: ['Amlodipine'],
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center border-b pb-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-5xl font-bold mb-4 md:mb-0">
              {patient.name.charAt(0)}
            </div>
            <div className="md:ml-6">
              <h2 className="text-2xl font-semibold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600 capitalize">{patient.gender}</p>
              <div className="flex items-center mt-2 text-gray-700 space-x-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-indigo-500" /> {patient.email}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-500" /> {patient.phone}
                </div>
              </div>
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 text-indigo-600 mr-2" /> Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" /> {patient.dob}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-medium text-gray-900 flex items-center mt-1">
                <Droplet className="h-4 w-4 mr-2 text-red-500" /> {patient.bloodGroup}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium text-gray-900">{patient.height}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium text-gray-900">{patient.weight}</p>
            </div>
          </div>

          {/* Medical Info */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 text-rose-500 mr-2" /> Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" /> Allergies
              </p>
              {patient.allergies.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {patient.allergies.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No allergies reported</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-1 text-green-500" /> Chronic Conditions
              </p>
              {patient.chronicConditions.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {patient.chronicConditions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No chronic conditions</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <Pill className="h-4 w-4 mr-1 text-purple-500" /> Current Medications
              </p>
              {patient.medications.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {patient.medications.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No medications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;