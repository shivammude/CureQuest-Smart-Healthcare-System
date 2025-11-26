// src/pages/admin/Patients.js
import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import { Search, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Fetch Patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/patients");
      setPatients(data.patients || []);
      setFiltered(data.patients || []);
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter + Sort
  useEffect(() => {
    let list = [...patients];

    if (searchTerm) {
      list = list.filter((p) =>
        p.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "latest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sortBy === "name") {
      list.sort((a, b) => a.userId?.name.localeCompare(b.userId?.name));
    }

    setFiltered(list);
  }, [searchTerm, sortBy, patients]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">All Patients</h1>
          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-2 rounded-lg shadow-sm"
            >
              <option value="latest">Latest Registered</option>
              <option value="oldest">Oldest Registered</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Patient List */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center mb-3">
                  <Users className="text-indigo-600 h-8 w-8" />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">{p.userId?.name}</h2>
                    <p className="text-sm text-gray-600">{p.userId?.email}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700">
                  <strong>Phone:</strong> {p.userId?.phone || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Gender:</strong> {p.gender}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>DOB:</strong>{" "}
                  {new Date(p.dateOfBirth).toLocaleDateString()}
                </p>

                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Registered: {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">No patients found</h2>
            <p className="text-gray-600">Try adjusting filters or search keywords.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPatients;
