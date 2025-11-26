// src/pages/admin/Users.js
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import { Search, Users } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data.users);
        setFiltered(data.users);
      } catch (error) {
        console.error("Users Fetch Error:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Filter logic
  useEffect(() => {
    let list = [...users];

    if (search.trim()) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }

    setFiltered(list);
  }, [search, roleFilter, users]);

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 flex items-center">
          <Users className="h-7 w-7 text-indigo-600 mr-2" />
          Users Management
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border rounded-lg pl-10 py-2"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="doctor">Doctors</option>
                <option value="patient">Patients</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Created At</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b capitalize">{u.role}</td>
                  <td className="p-3 border-b">
                    {format(new Date(u.createdAt), "MMM dd, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-4">No users found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
