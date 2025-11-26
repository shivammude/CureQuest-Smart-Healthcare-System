// src/pages/admin/Doctors.js
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import { Search, Stethoscope, Calendar } from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors");
      setDoctors(data.doctors);
      setFiltered(data.doctors);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Search filtering
  useEffect(() => {
    const term = search.toLowerCase();

    const results = doctors.filter((d) =>
      d.userId?.name?.toLowerCase().includes(term) ||
      d.userId?.email?.toLowerCase().includes(term) ||
      d.userId?.phone?.toLowerCase().includes(term) ||
      d.specialization?.toLowerCase().includes(term)
    );

    setFiltered(results);
  }, [search, doctors]);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Doctors</h1>

        {/* Search Bar */}
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Doctor
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              className="w-full pl-10 p-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div
              key={d._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Stethoscope className="text-blue-600 h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Dr. {d.userId?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{d.userId?.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p><strong>Phone:</strong> {d.userId?.phone || "N/A"}</p>
                <p><strong>Specialization:</strong> {d.specialization}</p>
                <p><strong>Qualification:</strong> {d.qualification || "N/A"}</p>
                <p><strong>Experience:</strong> {d.experience ? `${d.experience} years` : "N/A"}</p>



                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Joined: {new Date(d.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-10">No doctors found.</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminDoctors;
