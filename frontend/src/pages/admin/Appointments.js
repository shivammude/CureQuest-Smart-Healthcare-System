// src/pages/admin/Appointments.js
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Calendar, Search } from "lucide-react";
import { format } from "date-fns";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterPatient, setFilterPatient] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments/admin"); // FIXED
        setAppointments(data.appointments);
        setFiltered(data.appointments);
      } catch (error) {
        console.error("Admin Fetch Appointments Error:", error);
        toast.error("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let list = [...appointments];

    // Search patient/doctor by name
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (ap) =>
          ap.patientId?.userId?.name?.toLowerCase().includes(s) ||
          ap.doctorId?.userId?.name?.toLowerCase().includes(s)
      );
    }

    // Filter Doctor
    if (filterDoctor !== "all") {
      list = list.filter((ap) => ap.doctorId?._id === filterDoctor);
    }

    // Filter Patient
    if (filterPatient !== "all") {
      list = list.filter((ap) => ap.patientId?._id === filterPatient);
    }

    // Filter by Date
    if (filterDate) {
      list = list.filter(
        (ap) =>
          format(new Date(ap.appointmentDate), "yyyy-MM-dd") === filterDate
      );
    }

    setFiltered(list);
  }, [search, filterDoctor, filterPatient, filterDate, appointments]);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 flex items-center text-gray-900">
          <Calendar className="h-7 w-7 text-indigo-600 mr-2" />
          Manage Appointments
        </h1>

        {/* Filters */}
        <div className="bg-white p-5 mb-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Search (patient/doctor)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-lg pl-10 py-2 mt-1"
                />
              </div>
            </div>

            {/* Filter by Doctor */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Filter by Doctor
              </label>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full border rounded-lg py-2 mt-1"
              >
                <option value="all">All Doctors</option>
                {Array.from(
                  new Map(
                    appointments.map((ap) => [
                      ap.doctorId?._id,
                      ap.doctorId?.userId
                    ])
                  ).values()
                ).map(
                  (d) =>
                    d && (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Filter by Patient */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Filter by Patient
              </label>
              <select
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="w-full border rounded-lg py-2 mt-1"
              >
                <option value="all">All Patients</option>

                {Array.from(
                  new Map(
                    appointments.map((ap) => [
                      ap.patientId?._id,
                      ap.patientId?.userId
                    ])
                  ).values()
                ).map(
                  (p) =>
                    p && (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Filter by Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Filter by Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border rounded-lg py-2 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow overflow-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border-b">Patient</th>
                <th className="p-3 border-b">Doctor</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((ap) => (
                <tr key={ap._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{ap.patientId?.userId?.name}</td>

                  <td className="p-3 border-b">{ap.doctorId?.userId?.name}</td>

                  <td className="p-3 border-b">
                    {format(new Date(ap.appointmentDate), "MMM dd, yyyy")}
                  </td>

                  <td className="p-3 border-b">{ap.timeSlot}</td>

                  <td className="p-3 border-b capitalize">{ap.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No appointments found.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAppointments;
