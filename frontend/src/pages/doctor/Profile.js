import React from "react";
import {
  User,
  Mail,
  Phone,
  Star,
  Calendar,
  Clock,
  Edit3,
  Briefcase,
  DollarSign,
} from "lucide-react";
import Layout from "../../components/Layout";
import { useAuthStore } from "../../store/authStore";

const DoctorProfile = () => {
  const { user } = useAuthStore();

  // Mock doctor data (replace later with backend data)
  const doctor = {
    name: user?.name || "Dr. John Smith",
    email: user?.email || "drjohn@example.com",
    phone: user?.phone || "+91 9876543210",
    specialization: user?.additionalInfo?.specialization || "Cardiologist",
    qualification: user?.additionalInfo?.qualification || "MBBS, MD",
    experience: user?.additionalInfo?.experience || 12,
    consultationFee: user?.additionalInfo?.consultationFee || 600,
    about:
      "Experienced cardiologist with a deep passion for patient care and modern treatment methods.",
    rating: 4.8,
    availability: {
      days: ["Mon", "Tue", "Wed", "Fri", "Sat"],
      time: "10:00 AM - 5:00 PM",
    },
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center border-b pb-6 mb-6">
            <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold">
              {doctor.name.charAt(0)}
            </div>

            <div className="md:ml-6 mt-4 md:mt-0">
              <h2 className="text-2xl font-semibold text-gray-900">
                {doctor.name}
              </h2>

              <p className="text-gray-600 text-lg">{doctor.specialization}</p>

              <div className="flex items-center text-gray-700 mt-2 space-x-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                  {doctor.email}
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                  {doctor.phone}
                </div>
              </div>
            </div>

            <div className="md:ml-auto mt-4 md:mt-0">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </button>
            </div>
          </div>

          {/* Professional Details */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
            Professional Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-medium text-gray-900">{doctor.qualification}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium text-gray-900">
                {doctor.experience} years
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-medium text-gray-900 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                ₹{doctor.consultationFee}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="font-medium text-gray-900 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                {doctor.rating}
              </p>
            </div>
          </div>

          {/* Availability */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Available Days</p>
              <p className="font-medium text-gray-900">
                {doctor.availability.days.join(", ")}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Timings</p>
              <p className="font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                {doctor.availability.time}
              </p>
            </div>
          </div>

          {/* About Section */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 text-purple-600 mr-2" />
            About
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              {doctor.about}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
