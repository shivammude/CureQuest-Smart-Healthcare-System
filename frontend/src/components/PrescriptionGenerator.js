import React, { useState } from 'react';
import { FileText, Plus, Trash2, Download, X, User, Calendar, Pill } from 'lucide-react';

const PrescriptionGenerator = () => {
  const [doctor, setDoctor] = useState({
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    registrationNo: 'MCI-123456',
    phone: '+91-9876543210',
    email: 'dr.sarah@healthcare.com'
  });

  const [patient, setPatient] = useState({
    name: 'John Doe',
    age: '35',
    gender: 'Male',
    phone: '+91-9876543211'
  });

  const [medications, setMedications] = useState([
    {
      name: 'Aspirin',
      dosage: '75mg',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take after breakfast'
    }
  ]);

  const [advice, setAdvice] = useState('Monitor blood pressure daily. Follow a low-salt diet. Exercise regularly for 30 minutes. Avoid smoking and alcohol.');
  
  const [showPreview, setShowPreview] = useState(false);

  const addMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const generatePDF = () => {
    setShowPreview(true);
  };

  const PrescriptionPreview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-8">
          {/* Prescription Header */}
          <div className="border-b-4 border-indigo-600 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-indigo-600 mb-2">Medical Prescription</h1>
                <p className="text-gray-600">Smart Healthcare System</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">{doctor.name}</h2>
            <p className="text-indigo-700">{doctor.specialization}</p>
            <p className="text-indigo-600 text-sm">{doctor.qualification}</p>
            <div className="mt-2 text-sm text-indigo-600">
              <p>Reg. No: {doctor.registrationNo}</p>
              <p>📞 {doctor.phone} | 📧 {doctor.email}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="mb-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Patient Name</p>
              <p className="font-semibold">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age / Gender</p>
              <p className="font-semibold">{patient.age} years / {patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-semibold">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>

          {/* Rx Symbol */}
          <div className="mb-4">
            <div className="text-5xl font-serif text-indigo-600">℞</div>
          </div>

          {/* Medications */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Prescribed Medications</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">#</th>
                  <th className="border border-gray-300 p-2 text-left">Medicine Name</th>
                  <th className="border border-gray-300 p-2 text-left">Dosage</th>
                  <th className="border border-gray-300 p-2 text-left">Frequency</th>
                  <th className="border border-gray-300 p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2 font-medium">{med.name}</td>
                    <td className="border border-gray-300 p-2">{med.dosage}</td>
                    <td className="border border-gray-300 p-2">{med.frequency}</td>
                    <td className="border border-gray-300 p-2">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Instructions</h3>
            <ul className="list-disc pl-5 space-y-1">
              {medications.map((med, index) => 
                med.instructions && (
                  <li key={index} className="text-gray-700">
                    <span className="font-medium">{med.name}:</span> {med.instructions}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Doctor's Advice */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">Doctor's Advice</h3>
            <p className="text-gray-700 leading-relaxed">{advice}</p>
          </div>

          {/* Signature */}
          <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-end">
            <div className="text-sm text-gray-600">
              <p>This is a digitally generated prescription</p>
              <p className="text-xs mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <div className="mb-2 font-serif text-2xl text-indigo-600">{doctor.name}</div>
              <div className="border-t-2 border-gray-800 pt-1">
                <p className="text-sm font-medium">Doctor's Signature</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => alert('PDF download functionality would be implemented with jsPDF library')}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center font-medium"
            >
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Prescription Generator</h1>
              <p className="text-gray-600">Create and manage medical prescriptions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-indigo-600" />
              Doctor Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={doctor.name}
                onChange={(e) => setDoctor({...doctor, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Doctor Name"
              />
              <input
                type="text"
                value={doctor.specialization}
                onChange={(e) => setDoctor({...doctor, specialization: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Specialization"
              />
              <input
                type="text"
                value={doctor.qualification}
                onChange={(e) => setDoctor({...doctor, qualification: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                placeholder="Qualification"
              />
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Patient Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient({...patient, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                placeholder="Patient Name"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={patient.age}
                  onChange={(e) => setPatient({...patient, age: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Age"
                />
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient({...patient, gender: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input
                type="text"
                value={patient.phone}
                onChange={(e) => setPatient({...patient, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Pill className="h-5 w-5 mr-2 text-purple-600" />
              Medications
            </h2>
            <button
              onClick={addMedication}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </button>
          </div>

          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-gray-700">Medicine #{index + 1}</span>
                  {medications.length > 1 && (
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="Medicine Name"
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="Dosage (e.g., 500mg)"
                  />
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="Frequency (e.g., Twice daily)"
                  />
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="Duration (e.g., 7 days)"
                  />
                </div>
                
                <input
                  type="text"
                  value={med.instructions}
                  onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                  className="w-full mt-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="Special Instructions (e.g., Take after meals)"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Doctor's Advice */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            Doctor's Advice
          </h2>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500"
            placeholder="Enter general advice for the patient..."
          />
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generatePDF}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center text-lg font-semibold shadow-lg"
          >
            <FileText className="h-6 w-6 mr-2" />
            Generate Prescription
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 How to Use</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
            <li>Fill in doctor and patient information</li>
            <li>Add medications with dosage and frequency</li>
            <li>Provide special instructions for each medicine</li>
            <li>Add general health advice</li>
            <li>Click "Generate Prescription" to preview</li>
            <li>Download as PDF for printing or sharing</li>
          </ul>
        </div>
      </div>

      {/* Prescription Preview Modal */}
      {showPreview && <PrescriptionPreview />}
    </div>
  );
};

export default PrescriptionGenerator;