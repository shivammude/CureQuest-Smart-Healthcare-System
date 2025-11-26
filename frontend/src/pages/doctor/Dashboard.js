// src/pages/doctor/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Used
import {
  Calendar,
  Users,
  Pill,
  Activity,
  Phone,    // Used
  Mail,     // Used
} from 'lucide-react';
import Layout from '../../components/Layout';
import { useAuthStore } from '../../store/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  format,
  isToday,
  isTomorrow, // Used
  addDays,
  startOfWeek,
  endOfWeek,
  isValid,
} from 'date-fns';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalPrescriptions: 0,
  });

  const [todayAppointments, setTodayAppointments] = useState([]);     // Used
  const [upcomingAppointments, setUpcomingAppointments] = useState([]); // Used
  const [recentPatients, setRecentPatients] = useState([]);           // Used
  const [weeklyStats, setWeeklyStats] = useState([]);                 // Used

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const appointmentsRes = await api.get('/appointments');
      const allAppointments = appointmentsRes.data.appointments || [];

      // Today's
      const today = allAppointments.filter(
        (apt) => isToday(new Date(apt.appointmentDate)) && apt.status === 'scheduled'
      );

      // Upcoming
      const upcoming = allAppointments
        .filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          return (
            isValid(aptDate) &&
            aptDate > new Date() &&
            aptDate <= addDays(new Date(), 7) &&
            apt.status === 'scheduled'
          );
        })
        .slice(0, 5);

      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const weekAppointments = allAppointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        return isValid(aptDate) && aptDate >= weekStart && aptDate <= weekEnd;
      });

      const completed = allAppointments.filter((apt) => apt.status === 'completed');
      const pending = allAppointments.filter((apt) => apt.status === 'scheduled');

      const uniquePatientIds = new Set(
        allAppointments.map((apt) => apt.patientId?._id).filter(Boolean)
      );

      const prescriptionsRes = await api.get(`/prescriptions/doctor/${user.doctorInfo._id}`);
      const prescriptions = prescriptionsRes.data.prescriptions || [];

      // Weekly stats
      const weeklyData = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        const target = format(date, 'yyyy-MM-dd');
        const dayAppointments = allAppointments.filter((apt) => {
          const aptDate = new Date(apt.appointmentDate);
          return isValid(aptDate) && format(aptDate, 'yyyy-MM-dd') === target;
        });

        weeklyData.push({
          day: format(date, 'EEE'),
          appointments: dayAppointments.length,
          completed: dayAppointments.filter((a) => a.status === 'completed').length,
        });
      }

      setStats({
        todayAppointments: today.length,
        weekAppointments: weekAppointments.length,
        totalPatients: uniquePatientIds.size,
        completedAppointments: completed.length,
        pendingAppointments: pending.length,
        totalPrescriptions: prescriptions.length,
      });

      setTodayAppointments(today);
      setUpcomingAppointments(upcoming);
      setWeeklyStats(weeklyData);

      const recentPatientsMap = new Map();
      [...allAppointments]
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
        .forEach((apt) => {
          if (apt.patientId && !recentPatientsMap.has(apt.patientId._id)) {
            recentPatientsMap.set(apt.patientId._id, {
              ...apt.patientId,
              lastVisit: apt.appointmentDate,
              appointmentId: apt._id,
            });
          }
        });
      setRecentPatients(Array.from(recentPatientsMap.values()).slice(0, 5));
    } catch (error) {
      console.error('Dashboard Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.doctorInfo._id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Dr. {user.name.split(' ')[1] || user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your practice overview for {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Calendar className="h-8 w-8" />
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Today's Appointments</p>
            <p className="text-4xl font-bold">{stats.todayAppointments}</p>
            <p className="text-xs opacity-80 mt-2">
              {stats.todayAppointments === 0
                ? 'No appointments today'
                : `${stats.todayAppointments} patient${stats.todayAppointments > 1 ? 's' : ''} scheduled`}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Activity className="h-8 w-8" />
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">This Week</p>
            <p className="text-4xl font-bold">{stats.weekAppointments}</p>
            <p className="text-xs opacity-80 mt-2">Total appointments</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="h-8 w-8" />
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Total Patients</p>
            <p className="text-4xl font-bold">{stats.totalPatients}</p>
            <p className="text-xs opacity-80 mt-2">Unique patients served</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Pill className="h-8 w-8" />
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Prescriptions</p>
            <p className="text-4xl font-bold">{stats.totalPrescriptions}</p>
            <p className="text-xs opacity-80 mt-2">Total prescribed</p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {weeklyStats.map((day) => {
              const max = Math.max(...weeklyStats.map(d => d.appointments), 1);
              const height = (day.appointments / max) * 100;
              return (
                <div key={day.day} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                  <div className="w-full bg-gray-200 rounded-full h-20 relative">
                    <div
                      className="absolute bottom-0 w-full bg-indigo-600 rounded-full transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {day.appointments}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {day.completed} done
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <Link to="/doctor/appointments" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {apt.patientId?.userId?.name || '—'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {apt.patientId?.gender || '—'} • {apt.patientId?.bloodGroup || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {apt.timeSlot}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Reason:</span> {apt.reasonForVisit}
                    </p>
                    {apt.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apt.symptoms.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500"></p>
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
              <Link to="/doctor/appointments" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => {
                  const aptDate = new Date(apt.appointmentDate);
                  return (
                    <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {apt.patientId?.userId?.name || '—'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {isValid(aptDate) ? format(aptDate, 'MMM dd, yyyy') : '—'} • {apt.timeSlot}
                          </p>
                        </div>
                        {isTomorrow(aptDate) && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                            Tomorrow
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{apt.reasonForVisit}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500"></p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
            <Link to="/doctor/patients" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          {recentPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPatients.map((patient) => (
                <div key={patient._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">
                        {patient.userId?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {patient.gender || '—'} • {patient.bloodGroup || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      {patient.userId?.phone || '—'}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-2" />
                      {patient.userId?.email || '—'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Last visit: {patient.lastVisit && isValid(new Date(patient.lastVisit))
                      ? format(new Date(patient.lastVisit), 'MMM dd, yyyy')
                      : '—'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent patients</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/doctor/appointments" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
              <Calendar className="h-8 w-8 mb-2" />
              <p className="font-semibold">Appointments</p>
              <p className="text-sm opacity-90">Manage schedule</p>
            </Link>
            <Link to="/doctor/patients" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
              <Users className="h-8 w-8 mb-2" />
              <p className="font-semibold">Patients</p>
              <p className="text-sm opacity-90">View records</p>
            </Link>
            <Link to="/doctor/prescriptions" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
              <Pill className="h-8 w-8 mb-2" />
              <p className="font-semibold">Prescriptions</p>
              <p className="text-sm opacity-90">Manage meds</p>
            </Link>
            <Link to="/doctor/profile" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
              <Activity className="h-8 w-8 mb-2" />
              <p className="font-semibold">Profile</p>
              <p className="text-sm opacity-90">Edit details</p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;