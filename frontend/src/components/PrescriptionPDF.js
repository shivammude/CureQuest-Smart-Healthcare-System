import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

const PrescriptionPDF = ({ prescription, onClose }) => {
  const generatePDF = async () => {
    const element = document.getElementById('prescription-content');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`prescription-${prescription._id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div id="prescription-content" className="bg-white p-8">
            {/* Header */}
            <div className="border-b-4 border-indigo-600 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-indigo-600">Medical Prescription</h1>
              <p className="text-gray-600 mt-1">Smart Healthcare System</p>
            </div>

            {/* Doctor Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Dr. {prescription.doctorId.userId.name}
              </h2>
              <p className="text-gray-600">{prescription.doctorId.specialization}</p>
              <p className="text-gray-600">{prescription.doctorId.qualification}</p>
            </div>

            {/* Patient Info */}
            <div className="mb-6 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Patient Information</h3>
              <p><strong>Name:</strong> {prescription.patientId.userId.name}</p>
              <p><strong>Date:</strong> {format(new Date(prescription.prescriptionDate), 'MMMM dd, yyyy')}</p>
            </div>

            {/* Medications */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Prescribed Medications</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Medicine</th>
                    <th className="border p-2 text-left">Dosage</th>
                    <th className="border p-2 text-left">Frequency</th>
                    <th className="border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medications.map((med, index) => (
                    <tr key={index}>
                      <td className="border p-2">{med.name}</td>
                      <td className="border p-2">{med.dosage}</td>
                      <td className="border p-2">{med.frequency}</td>
                      <td className="border p-2">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            {prescription.medications.some(m => m.instructions) && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {prescription.medications.map((med, index) => 
                    med.instructions && (
                      <li key={index}>{med.name}: {med.instructions}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Advice */}
            {prescription.advice && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Doctor's Advice</h3>
                <p className="text-gray-700">{prescription.advice}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-gray-600">
                This is a computer-generated prescription and is valid without signature.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={generatePDF}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPDF;