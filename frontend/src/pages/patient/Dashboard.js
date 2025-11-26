// src/pages/patient/Dashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  FileText,
  Pill,
  LogOut,
  Activity,
  Clock,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { format, isToday, isFuture } from "date-fns";

const PatientDashboard = () => {
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalRecords: 0,
    prescriptions: 0,
  });

  const [,setUpcomingAppointments] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [patientNotes, setPatientNotes] = useState([]);
  const [showPatientNotes, setShowPatientNotes] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchPatientNotes = async () => {
    try {
      const res = await api.get(
        `/medical-records/patient/${user.patientInfo._id}/created-by-patient`
      );
      setPatientNotes(res.data.records || []);
    } catch (err) {
      toast.error("Failed to load patient notes");
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch appointments
      const appointmentsRes = await api.get("/appointments", {
        params: { status: "scheduled" },
      });

      const appointments = appointmentsRes.data.appointments || [];
      const upcoming = appointments.filter(
        (apt) =>
          isFuture(new Date(apt.appointmentDate)) ||
          isToday(new Date(apt.appointmentDate))
      );

      setUpcomingAppointments(upcoming.slice(0, 3));

      // Fetch medical records
      const recordsRes = await api.get(
        `/medical-records/patient/${user.patientInfo._id}`
      );
      setRecentRecords(recordsRes.data.records?.slice(0, 3) || []);

      // Fetch prescriptions
      const prescriptionsRes = await api.get(
        `/prescriptions/patient/${user.patientInfo._id}`
      );

      setStats({
        upcomingAppointments: upcoming.length,
        totalRecords: recordsRes.data.count || 0,
        prescriptions: prescriptionsRes.data.count || 0,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user.patientInfo?._id]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">CureQuest</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h2>
          <p className="mt-1 text-gray-600">
            Here's an overview of your health information
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/patient/appointments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link to="/patient/medical-records" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Medical Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalRecords}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Link>

          <Link to="/patient/prescriptions" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.prescriptions}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Medical Records</h3>

            {/* PATIENT NOTES TOGGLE BUTTON */}
            <button
              onClick={async () => {
                const newVal = !showPatientNotes;
                setShowPatientNotes(newVal);
                if (newVal) await fetchPatientNotes();
              }}
              className={`px-3 py-1 text-sm font-medium rounded-lg border ${
                showPatientNotes
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-300"
              }`}
            >
              Expand Medical Records
            </button>
          </div>

          {/* ------------------- PATIENT NOTES SECTION ------------------- */}
          {showPatientNotes ? (
            patientNotes.length > 0 ? (
              <div className="space-y-4">
                {patientNotes.map((record) => (
                  <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300">
                    <p className="font-medium text-gray-900">Patient provided notes</p>

                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </p>

                    <p className="text-sm mt-2 text-gray-700">
                      {record.notes || "No details added"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No patient-provided notes yet</p>
              </div>
            )
          ) : (
            <>
              {/* ------------------- ORIGINAL RECENT 3 RECORDS ------------------- */}
              {recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => (
                    <div key={record._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {record.diagnosis || "Patient provided notes"}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(record.visitDate || record.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>

                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No medical records yet</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/patient/book-appointment"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Appointment
            </Link>

            <Link
              to="/patient/appointments"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border rounded-lg"
            >
              <Clock className="h-5 w-5 mr-2" />
              My Appointments
            </Link>

            <Link
              to="/patient/medical-records"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border rounded-lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Medical Records
            </Link>

            <Link
              to="/patient/prescriptions"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border rounded-lg"
            >
              <Pill className="h-5 w-5 mr-2" />
              Prescriptions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
