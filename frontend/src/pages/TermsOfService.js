import React from "react";
import Layout from "../components/Layout";
import { HeartPulse, Users, ShieldCheck, Stethoscope } from "lucide-react";

const TermsofService = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          CureQuest is a modern Smart Healthcare System designed to simplify
          healthcare management for patients, doctors, and administrators.
          Our platform ensures seamless appointment booking, secure medical
          record storage, and real-time access to essential health information.
        </p>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <HeartPulse className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To make healthcare accessible, organized, and efficient through technology.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <Users className="h-10 w-10 text-indigo-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Who We Serve</h3>
            <p className="text-gray-600">
              Patients, doctors, hospitals, and clinics who want simplified digital healthcare.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <ShieldCheck className="h-10 w-10 text-green-500 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Security First</h3>
            <p className="text-gray-600">
              Your health data is encrypted and protected with advanced security.
            </p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Why Choose CureQuest?</h2>
          </div>

          <ul className="mt-4 space-y-3 text-gray-700">
            <li>✔ Easy appointment booking</li>
            <li>✔ Secure medical record access</li>
            <li>✔ Real-time updates & reminders</li>
            <li>✔ Patient & doctor friendly dashboard</li>
            <li>✔ Fast, reliable, and user friendly</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default TermsofService;
