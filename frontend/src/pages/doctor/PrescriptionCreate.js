// src/pages/doctor/PrescriptionCreate.js
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const PrescriptionCreate = () => {
  const { user } = useAuthStore();

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientId: "",
    appointmentId: "",
    advice: "",
    medications: [
      { name: "", dosage: "", duration: "" }
    ]
  });

  // Fetch doctor’s patients + appointments
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const patientRes = await api.get("/patients");
      const appointmentRes = await api.get("/appointments");

      setPatients(patientRes.data.patients || []);
      setAppointments(appointmentRes.data.appointments || []);

    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (index, field, value) => {
    const updatedMeds = [...formData.medications];
    updatedMeds[index][field] = value;
    setFormData({ ...formData, medications: updatedMeds });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", dosage: "", duration: "" }]
    });
  };

  const removeMedicine = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.medications.length === 0) {
      return toast.error("Add at least one medication!");
    }

    try {
      await api.post("/prescriptions", formData);

      toast.success("Prescription created successfully!");
      setFormData({
        patientId: "",
        appointmentId: "",
        advice: "",
        medications: [{ name: "", dosage: "", duration: "" }]
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create prescription");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Prescription</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">

          {/* Select Patient */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Select Patient</label>
            <select
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.userId?.name} ({p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Select Appointment */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Select Appointment</label>
            <select
              value={formData.appointmentId}
              onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Appointment --</option>
              {appointments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.patientId?.userId?.name} - {a.timeSlot}
                </option>
              ))}
            </select>
          </div>

          {/* Medications */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Medications</label>

            {formData.medications.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 items-center">
                
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Dosage (e.g., 1-0-1)"
                  value={med.dosage}
                  onChange={(e) => handleChange(index, "dosage", e.target.value)}
                  className="p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Duration (e.g., 5 days)"
                  value={med.duration}
                  onChange={(e) => handleChange(index, "duration", e.target.value)}
                  className="p-2 border rounded"
                />

                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center text-indigo-600 font-medium mt-2 hover:underline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Medicine
            </button>
          </div>

          {/* Advice */}
          <div className="mt-6">
            <label className="block font-medium text-gray-700 mb-1">Doctor's Advice</label>
            <textarea
              value={formData.advice}
              onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
              className="w-full p-3 border rounded h-28"
              placeholder="Enter advice..."
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Submit Prescription
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PrescriptionCreate;
